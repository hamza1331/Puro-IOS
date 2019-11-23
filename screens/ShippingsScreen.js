import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator,Text } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import {selectShippingAction } from "../store/actions/actions";
import { connect } from "react-redux";
class ShippingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null
    }
    this.arrayholder = []
  }
  componentDidMount() {
    if(this.props.shippings.length>0){
        this.setState({
            data:this.props.shippings,
            loading: false
        })
        this.arrayholder = this.props.shippings;
    }
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '10%',
        }}
      />
    );
  };
  searchFilterFunction = text => {
    this.setState({
      value: text,
    });
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.title.toUpperCase()}`
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    });
    this.setState({
      data: newData,
    });
  };
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search Shipping Profiles"
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };
  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        {this.state.data.length>0 && <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
            onPress={()=>{
              let profile = this.state.data.filter(profile => profile._id === item._id)
              this.props.selectShipping(profile[0])
              this.props.navigation.goBack()
              
            }}
              title={`${item.title}`}
              subtitle={item.description.substring(0,100)}
              titleStyle={{fontSize:18,fontWeight:'bold'}}
            />
          )}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />}
        {this.state.data.length===0&& <View>
            <Text>No Shipping Profile Found!</Text>
        </View>}
      </View>
    );
  }
}
function mapStateToProps(state){
  return({
    UID:state.rootReducer.UID,
    shippings:state.rootReducer.shippings
  })
}
function mapActionsToProps(dispatch){
  return({
   selectShipping:(profile)=>{
       dispatch(selectShippingAction(profile))
   }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(ShippingsScreen);