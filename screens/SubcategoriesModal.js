import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

import { selectCategoryAction,hideSubCategoriesMOdalAction,setSubCategoryAction } from "../store/actions/actions";
import {SafeAreaView} from 'react-navigation'
import { connect } from "react-redux";
import Modal from 'react-native-modal'




class SubbcategoriesModals extends Component{

  _toggleModalCat=()=>{
    this.props.hideSubCategories()
  }
  
  
render(){
  return(
  <Modal isVisible={this.props.showSubCategories} style={{borderRadius:15,backgroundColor:'white',margin:0}} 
       swipeDirection="down" onBackButtonPress={this._toggleModalCat} onSwipeComplete={this._toggleModalCat}>
          <SafeAreaView style={{flex:1}}>
<View style={{borderBottomColor:'gray',borderBottomWidth:2,paddingBottom:5}}>
  <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,marginTop:10}}>Subcategorias</Text>
</View>
<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:10,flexWrap:'wrap'}}>
       {this.props.subCategories.length>0&&this.props.subCategories.map((cat,index)=>{
         return <View key={cat._id} style={{alignItems:'center',flexBasis:'25%'}}>
         <Icon
                 reverse
                 name={cat.iconType}
                 type={cat.iconName}
                 color='#4d2600'
                 onPress={()=>{
                   this.props.setSubCategory(cat.name)
                   this.props.hideSubCategories()
                   this.props.navigation.navigate('ListingScreen')
                 }}
                 containerStyle={{alignSelf:'center'}}
               />
           <Text style={{textAlign:'center'}}>{cat.name}</Text>
         </View>
       })}
  </View>

          </SafeAreaView>
        </Modal>
  )
}
}
function mapStateToProps(state){
  return({
      showSubCategories:state.rootReducer.showSubCategories,
      subCategories:state.rootReducer.subCategories
  })
}
function mapActionsToProps(dispatch){
  return({
      selectCategory:(category)=>{
          dispatch(selectCategoryAction(category))
      },
      hideSubCategories:()=>{
        dispatch(hideSubCategoriesMOdalAction())
      },
      setSubCategory:(cat)=>{
          dispatch(setSubCategoryAction(cat))
      }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(SubbcategoriesModals)