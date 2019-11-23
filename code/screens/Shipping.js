/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import { url } from "./Proxy";
import { connect } from "react-redux";

import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator,Alert,TouchableOpacity,Text,StyleSheet,Platform,ToastAndroid,SafeAreaView } from 'react-native';
import { ListItem, SearchBar, Icon } from 'react-native-elements';
import { setShippingProfileAction} from "../store/actions/actions";
class Shipping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    this.setState({loading:true})
    fetch(url+'/api/getShippings'+this.props.UID)
     .then(res=>res.json())
     .then(data=>{
      if(data.message==='Success'){
        this.setState({
          data: data.data,
          error: data.err || null,
          loading: false,
        });
        this.arrayholder = data.data;
      }
     }).catch(err=>{
      this.setState({ error:err, loading: false });
     }) 
  };

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
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Buscar Perfiles de Envio"
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
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          onRefresh={this.makeRemoteRequest}
          refreshing={this.state.loading}
          renderItem={({ item }) => (
            <ListItem
            onPress={()=>{
              let profile = this.state.data.filter(profile => profile._id === item._id)
              this.props.setShippingProfile(profile[0])
              this.props.navigation.navigate('ShippingForm')
            }}
            rightIcon={
              <Icon
              name='clear'
              type='material'
              color='darkred'
              onPress={()=>{
                Alert.alert(
                  'Advertencia',
                  'Realmente quieres borrar??',
                  [
                    {text: 'Borrar', onPress: () => {
                      fetch(url+'/api/deleteShipping'+item._id,{method:"DELETE",headers: { "Content-Type": "application/json" }})
                      .then(res=>res.json())
                      .then(response=>{
                        if(response.message==='Success'){
                          let profiles = this.state.data.filter(profile=>profile._id!==item._id)
                          this.setState({
                            data:profiles
                          })
                          if(Platform.OS==='android'){
                            ToastAndroid.showWithGravityAndOffset(
                              'Envio Perfil Eliminado!!',
                              ToastAndroid.LONG,
                              ToastAndroid.BOTTOM,
                              25,
                              50,
                            );
                          }
                        }
                        else{

                        }
                      })
                    }, style: 'cancel'},
                    {text: 'Cancelar', onPress: () => {
                    } },
                  ]
                );
              }}
              />
            }
              title={`${item.title}`}
              subtitle={item.description.substring(0,100)}
              titleStyle={{fontSize:18,fontWeight:'bold'}}
            />
          )}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
        <TouchableOpacity onPress={() => {
              this.props.setShippingProfile(null)
          this.props.navigation.navigate('ShippingForm')
        }} style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({ 
  fab: { 
    position: 'absolute', 
    width: 56, 
    height: 56, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: 'darkred', 
    borderRadius: 30, 
    elevation: 8 
    }, 
    fabIcon: { 
      fontSize: 40, 
      color: 'white' 
    }
});
function mapStateToProps(state){
  return({
    UID:state.rootReducer.UID
  })
}
function mapActionsToProps(dispatch){
  return({
   setShippingProfile:(profile)=>{
     dispatch(setShippingProfileAction(profile))
    }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Shipping);