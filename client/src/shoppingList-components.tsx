import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Column } from './widgets';
import shoppingListService, { ShoppingListInfo } from './shoppingList-service';
import { loggedIn, currentUser } from './user-components';
import { createHashHistory } from 'history';
import { Container, Card, Row, Form, Button, Col } from 'react-bootstrap';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a recipe

export class ShoppingList extends Component {
  shopping_list: ShoppingListInfo[] = [];

  render() {
    let emptyShoppingListMessage = '';

    if (this.shopping_list.length == 0) {
      //@ts-ignore
      emptyShoppingListMessage = (
        <div>
          Your shopping list is currently empty. You are welcome to add some from the{' '}
          <a href="http://localhost:3000/#/recipes">recipes</a> that you find tempting{' '}
        </div>
      );
    } else {
      emptyShoppingListMessage = '';
    }

    return (
      <Card
        style={{
          padding: '15px',
          textAlign: 'center',
          border: 'none',
        }}
      >
        <Card.Title>Shopping list</Card.Title>

        <Row
          style={{
            marginLeft: '7%',
            width: '90%',
          }}
        >
          <Col>
            {emptyShoppingListMessage}

            {this.shopping_list.map((list) => (
              <Row key={list.shopping_list_id}>
                <Col
                  style={{
                    textAlign: 'right',
                  }}
                >
                  {list.amount + ' ' + list.measurement_unit + ' ' + list.name}
                </Col>
                <Col>
                  <Button
                    variant="light"
                    onClick={() => this.deleteOne(list.shopping_list_id, list.name)}
                    style={{
                      width: '5rem',
                      marginLeft: '0px',
                      marginRight: '100%',
                      marginBottom: '10px',
                    }}
                  >
                    &#128465;
                  </Button>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>

        <Row>
          <Button
            variant="danger"
            onClick={() => this.deleteAll()}
            style={{
              width: '15rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '10px',
            }}
          >
            Delete all
          </Button>
        </Row>
      </Card>
    );
  }

  mounted() {
    if (!loggedIn) {
      Alert.info('Log in to use this feature');
    } else {
      shoppingListService
        .getShoppingList(currentUser.user_id)
        .then((list) => (this.shopping_list = list))
        .catch((error) => Alert.danger('Error getting shopping list ' + error.message));
    }
  }

  deleteOne(list_id: number, name: string) {
    if (confirm('Do you want to remove ' + name + ' from the shopping list?')) {
      console.log(list_id);
      shoppingListService
        .deleteItemShoppingList(list_id)
        .then(() => Alert.success('Item deleted'))
        .then(() => this.mounted()) // refreshes til items in shopping list
        .catch((error) => Alert.danger('Error deleting item in shopping list: ' + error.message));
    } else {
      console.log('Canceled');
    }
  }

  deleteAll() {
    if (!loggedIn) {
      Alert.info('Please log in');
    } else {
      if (this.shopping_list.length > 0) {
        if (confirm('Do you want to remove all items from shopping list?')) {
          shoppingListService
            .deleteShoppingList(currentUser.user_id)
            .then(() => Alert.info('Shopping list was successfully deleted'))
            .then(() => this.mounted())
            .catch((error) => Alert.danger('Error deleting shopping list ' + error.message));
        } else {
          console.log('Canceled');
        }
      } else {
        Alert.info('No items to delete');
      }
    }
  }
}
