import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Card from './Card'

const style = {
}

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { cards } = this.props

    return (
      <div style={style}>
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            text={card.text}
            moveCard={this.props.moveCard}
          />
        ))}
      </div>
    )
  }
}
