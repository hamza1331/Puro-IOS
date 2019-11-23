/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, {Component} from 'react';
import {Text, View,Alert} from 'react-native';
import {Icon} from 'react-native-elements';

import { selectCategoryAction,hideListingCategoriesAction,showSubCategoriesMOdalAction,setSubCategoriesForListingAction,categorySelectedAction,hideSubCategoriesMOdalAction,setSubCategoryAction } from "../store/actions/actions";
import {SafeAreaView} from 'react-navigation'
import { connect } from "react-redux";
import Modal from 'react-native-modal'




class Modals extends Component{
  
  constructor(props){
    super(props);
    this.state={
      colors:['#64BBFF','#2FFAA1','#D4FA51','#63FA2F','#CE64FF','#FABA51','#FF7964','#FFE064','#64ADFF','#FF64C4','#9ef442',
                "#ffcd70","#c5ff70","#70ff77","#70ebff","#ff9189","#9385f2","#ee71fc","#37e8d9","#36e87a","#e89135","#cd7cff"]
    }
  }

  _toggleModalCat=()=>{
    this.props.hideListingCategories()
  }
  
render(){
  return(
  <Modal isVisible={this.props.showListingCategories} style={{borderRadius:15,backgroundColor:'white',margin:0}} 
       swipeDirection="down" onBackButtonPress={this._toggleModalCat} onSwipeComplete={this._toggleModalCat}>
          {this.props.showListingCategories&&this.props.showSubCategories===false&& <SafeAreaView style={{flex:1}}>
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
                  //  this.props.selectCategory(cat.name)
                  //  this.props.setSubCategoriesForListing(cat._id)
                   let data = {
                     category:cat.name,
                     id:cat._id
                   }
                   this.props.categorySelected(data)
                  //  this.props.navigation.navigate('ListingScreen')
                 }}
                 containerStyle={{alignSelf:'center'}}
               />
           <Text style={{textAlign:'center'}}>{cat.name}</Text>
         </View>
       })}
  </View>

          </SafeAreaView>}
          {this.props.showListingCategories===true&& this.props.showSubCategories===true&& <SafeAreaView style={{flex:1}}>
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
                 color='darkred'
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

          </SafeAreaView>}
        </Modal>
  )
}
}
function mapStateToProps(state){
  return({
      selectedCategory:state.rootReducer.selectedCategory,
      showListingCategories:state.rootReducer.showListingCategories,
      categories:state.rootReducer.categories,
      showSubCategories:state.rootReducer.showSubCategories,
      subCategories:state.rootReducer.subCategories
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
      },
      categorySelected:(data)=>{
        dispatch(categorySelectedAction(data))
      },
    hideSubCategories:()=>{
      dispatch(hideSubCategoriesMOdalAction())
    },
    setSubCategory:(cat)=>{
        dispatch(setSubCategoryAction(cat))
    }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Modals)