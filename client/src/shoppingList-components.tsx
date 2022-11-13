import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import shoppingListService, { ShoppingListInfo } from './shoppingList-service';
import { loggedIn, currentUser } from './user-components';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a recipe

export class ShoppingList extends Component {
  shopping_list: ShoppingListInfo[] = [];

  render() {
    return (
      <Card title="Shopping List">
        {this.shopping_list.map((list) => (
          <Row key={list.shopping_list_id}>
            <Column width={3}>{list.amount + ' ' + list.measurement_unit + ' ' + list.name}</Column>
            <Column width={1}>
              <Button.Light onClick={() => this.deleteOne(list.shopping_list_id, list.name)}>
                &#128465;
              </Button.Light>
            </Column>
          </Row>
        ))}
        <Button.Danger
          onClick={() => {
            this.deleteAll();
          }}
        >
          Remove items
        </Button.Danger>
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
