import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

import { selectCategoryAction,hideListingCategoriesAction,showSubCategoriesMOdalAction,setSubCategoriesForListingAction } from "../store/actions/actions";
import {SafeAreaView} from 'react-navigation'
import { connect } from "react-redux";
import Modal from 'react-native-modal'




class Modals extends Component{
  
  constructor(props){
    super(props);
    this.categories=[
      {name:'Beauty',iconName:'face',iconType:'material'},{name:'Home',iconName:'home',iconType:'material'},{name:'Jewelry',iconName:'ring',iconType:'material-community'},{name:'Art',iconName:'drawing',iconType:'material-community'},{name:'Entertainment',iconName:'music',iconType:'material-community'},{name:'Entertainment',iconName:'music',iconType:'material-community'},{name:'Beauty',iconName:'face',iconType:'material'},{name:'Home',iconName:'home',iconType:'material'},{name:'Jewelry',iconName:'ring',iconType:'material-community'},{name:'Art',iconName:'drawing',iconType:'material-community'},{name:'Entertainment',iconName:'music',iconType:'material-community'},{name:'Entertainment',iconName:'music',iconType:'material-community'}
    ]
    this.state={
      isCatModalVisible:false,
      name:""
    }
  }

  _toggleModalCat=()=>{
    this.props.hideListingCategories()
  }
  
  
render(){
  return(
  <Modal isVisible={this.props.showListingCategories} style={{borderRadius:15,backgroundColor:'white',margin:0}} 
       swipeDirection="down" onBackButtonPress={this._toggleModalCat} onSwipeComplete={this._toggleModalCat}>
          <SafeAreaView style={{flex:1}}>
<View style={{borderBottomColor:'gray',borderBottomWidth:2,paddingBottom:5}}>
  <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,marginTop:10}}>Todas las Categorias</Text>
</View>
<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:10,flexWrap:'wrap'}}>
       {this.props.categories.length>0&&this.props.categories.map((cat,index)=>{
         return <View key={cat._id} style={{alignItems:'center',flexBasis:'25%'}}>
         <Icon
                 reverse
                 name={cat.iconType}
                 type={cat.iconName}
                 color='#4d2600'
                 onPress={()=>{
               this.props.selectCategory(cat.name)
               this.props.setSubCategoriesForListing(cat._id)
               this.props.hideListingCategories()
               this.props.showSubCategoriesMOdal()
                  //  this.props.navigation.navigate('ListingScreen')
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
      selectedCategory:state.rootReducer.selectedCategory,
      showListingCategories:state.rootReducer.showListingCategories,
      categories:state.rootReducer.categories
  })
}
function mapActionsToProps(dispatch){
  return({
      selectCategory:(category)=>{
          dispatch(selectCategoryAction(category))
      },
      hideListingCategories:()=>{
        dispatch(hideListingCategoriesAction())
      },
      showSubCategoriesMOdal:()=>{
        dispatch(showSubCategoriesMOdalAction())
      },
      setSubCategoriesForListing:(id)=>{
        dispatch(setSubCategoriesForListingAction(id))
      }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Modals)