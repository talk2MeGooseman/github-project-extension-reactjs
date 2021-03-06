import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'
import {
  findDOMNode
} from 'react-dom'
import {
  DragSource,
  DropTarget
} from 'react-dnd';
import ItemTypes from '../lib/ItemTypes';
import ProjectListItem from "./ProjectListItem";

const style = {
  border: '1px solid gray',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

// Define event handlers for source of action
const repoSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    }
  },
}

// Define event handlers for item being targeted
const repoTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  },
}

const connectDropTarget = (connect) => ({
  connectDropTarget: connect.dropTarget(),
});

const connectDragTarget = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

/**
 * DraggableRepo
 * 
 * Wraps a ProjectListItem to provide Drag and Drag behavior
 * 
 * @class DraggableRepo
 * @extends {Component}
 */
class DraggableRepo extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
  }

  render() {
    const {
      repo,
      isDragging,
      connectDragSource,
      connectDropTarget,
    } = this.props
    const opacity = isDragging ? 0 : 1

    return connectDragSource(
        connectDropTarget(
            <div style={{ ...style, opacity }} >
                <ProjectListItem repo={repo} draggable />
            </div>
        ),
      )
    }
  }

  const DT = DropTarget(ItemTypes.REPO, repoTarget, connectDropTarget)(DraggableRepo);
  export default DragSource(ItemTypes.REPO, repoSource, connectDragTarget)(DT);
