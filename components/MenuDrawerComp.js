/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React from 'react'
import {View,Text,TouchableOpacity,FlatList,AsyncStorage,ActivityIndicator,ScrollView,Platform} from'react-native'
import {Avatar,Button,Icon,Header} from 'react-native-elements'
import { connect } from "react-redux";
import { url } from "../screens/Proxy";
import { selectCategoryAction,setCategoriesAction,setSubCategoriesAction,addtListingsAction,setQueryAction } from "../store/actions/actions";
import firebase from 'react-native-firebase';
class MenuDrawer extends React.Component{
    constructor(props){
        super(props)
            this.state={
                data:[],
                ismodalVisible:false,
                profilePic:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                username:'',
                UID:'',
                page:1,
                loading:false,
                colors:['#64BBFF','#2FFAA1','#D4FA51','#63FA2F','#CE64FF','#FABA51','#FF7964','#FFE064','#64ADFF','#FF64C4','#9ef442',
                "#ffcd70","#c5ff70","#70ff77","#70ebff","#ff9189","#9385f2","#ee71fc","#37e8d9","#36e87a","#e89135","#cd7cff"
              ],
              showCategories:false
            }
        this.NavigateToHome=this.NavigateToHome.bind(this)
        this.messageIdGenerator=this.messageIdGenerator.bind(this)
        this.handleRefresh=this.handleRefresh.bind(this)
    }
    Openmodal=()=>{
        this.setState({
            showCategories:true
        })
    }
    Closemodal=()=>{
        this.setState({
            showCategories:false
        })
    }
    messageIdGenerator() {
        // generates uuid.
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    navLink(nav,text){ 
        return(
            <TouchableOpacity onPress={()=>{
              if(text==='Inicio'){
                this.handleRefresh()
              this.props.navigation.navigate('HomeScreen')

              }
              else{
              this.props.navigation.navigate(nav)
              this.props.navigation.toggleDrawer()
              }
            }}>
                <Text style={{fontSize:15,fontWeight:'bold',marginLeft:20,marginTop:20}}>{text}</Text>
            </TouchableOpacity>
        )
    }
    componentDidMount(){
        fetch(url+'/api/getCategories').then(res=>res.json()).then(data=>{
            this.props.setCategories(data.docs)
        }).catch(err=>console.log(err))
        AsyncStorage.getItem('userData').then(data=>{
            let user = JSON.parse(data)
            console.log(user)
            this.setState({
              username:user.fName,
              UID:user.firebaseUID
            })
            if(user.profilePic){
              this.setState({
                profilePic:user.profilePic
              })
            }
        })
    }
    NavigateToHome(name,sub){
        this.setState({
            loading:true
        })
        let data = {
            Category:name
          }
        this.props.setQuery(data)

          fetch(url+'/api/getListings'+this.state.page,{body:JSON.stringify(data),method:"POST",headers: { "Content-Type": "application/json" }}).then(res=>res.json())
          .then(response=>{
            this.props.addtListings({
              page:this.state.page,
              listings:response.data
            })
            this.setState({
              loading:false
            })
            this.props.selectCategory(name)
            this.props.setSubCategories(sub)
            this.Closemodal()
            this.props.navigation.toggleDrawer()
            this.props.navigation.navigate('HomeScreen')
          }).catch(err=>console.log(err))
        // this.props.navigation.navigate('HomeScreen')
    }
    handleRefresh(){
        this.setState({
            loading:true
        })
        fetch(url+'/api/getListings'+this.state.page,{method:"POST",headers: { "Content-Type": "application/json" }}).then((res)=>res.json()).then((data)=>{
            if(this.state.page===1){
              if(data.data.length===0)
            {
              this.setState({
                loading:false
              })
              return
            }
            this.props.setQuery(null)
            this.props.selectCategory('')
            this.props.setSubCategories([])
            this.Closemodal()
            this.props.navigation.toggleDrawer()

            this.props.addtListings({
              page:this.state.page,
              listings:data.data
            })
              this.setState({
                loading:false
              })
            }
    
          })
    }
render(){
    if (this.state.loading) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={Platform.OS==='android'?30:0} color='purple' animating />
          </View>
        );
      }  
    else return(  
    <View style={{flex:1}}>
     {this.state.showCategories===false && <View>
      <View style={{backgroundColor:'#C3B09D',height:160,width:'100%',flexDirection:'row'}}>
     {this.state.profilePic==='' &&  <Avatar containerStyle={{marginLeft:30,marginTop:40}} onPress={()=>{this.props.navigation.navigate('Profile')}}
       size="large"
       rounded
       title="Add Profile Photo"
       titleStyle={{fontSize:12,flexWrap:'wrap'}}
     />  }
     {this.state.profilePic!=='' &&  <Avatar containerStyle={{marginLeft:30,marginTop:40}} onPress={()=>{this.props.navigation.navigate('Profile')}}
       size="large"
       rounded
      source={{uri:this.state.profilePic}}
     />  }
     <Text style={{fontSize:20,fontWeight:'bold',color:'white',marginLeft:10,marginTop:60}}>{this.state.username!==''?this.state.username:"No Name"}</Text>
     </View>
     <View style={{marginTop:20}}>
     {this.navLink('HomeScreen','Inicio')}
     {this.navLink('Conversations','Conversaciones')}
     {this.navLink('Orders','Pedidos')}
     {this.navLink('Report','Informe/Sugerencia')}
     {this.navLink('Payment','Información de Pago')}
     {this.navLink('Profile','Perfil')}
     {this.navLink('Shipping','Perfiles de Envios')}
     <TouchableOpacity onPress={()=>{
         firebase.auth().signOut()
         .then(()=>{
             let data = {
                 firebaseUID:this.props.UID
             }
            AsyncStorage.removeItem('userData')
            fetch(url+'/api/logout',{method:"PUT",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
            .then(res=>res.json())
            .then(response=>{
                if(response.message==='Success'){
                    this.props.navigation.navigate('ProviderLogin')
                }
            })
         }).catch(err=>console.log(err))
}}>
<Text style={{fontSize:15,fontWeight:'bold',marginLeft:20,marginTop:20,color:'red'}}>Cerrar sesión</Text>
</TouchableOpacity>
     </View>
     <View style={{alignItems:'center',justifyContent:'flex-end'}}>
          <View style={{position: 'absolute',
      width:180,
      height:40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#D1802E',
      borderRadius:10,
      marginTop:50,
      top:'60%',
      bottom:'10%',
      marginBottom:15
      }}>
            <Button title="Todas las Categorias" titleStyle={{fontSize:16}} onPress={this.Openmodal} buttonStyle={{backgroundColor:'#D1802E',height:40}}/>
          </View>
          </View>
     </View>}
        {this.state.showCategories &&  <View style={{backgroundColor:'white',marginBottom:10,marginTop:0,marginLeft:0,borderRadius:8,height:"98%"}}>
   <Header placement="left"
    leftComponent={
      <Icon  containerStyle={{marginBottom:8}}
    name="ios-arrow-round-back"
    type="ionicon"
    color="black"
    size={40}
    onPress={this.Closemodal}
   />
      }
      containerStyle={{backgroundColor:'white', borderTopLeftRadius:15,
      borderTopRightRadius:15
    }}
      />

   <Text style={{textAlign:"center",fontSize:28,fontWeight:'bold',marginTop:10,color:'darkred'}}>CATEGORIAS</Text>
   <View onTouchEnd={this.handleRefresh} style={{paddingBottom:10,borderBottomColor:'purple',borderBottomWidth:2,flexDirection:'row'}}>
  <Text style={{fontSize:22,marginLeft:15,marginRight:10,paddingTop:10,fontWeight:'bold'}}>Todas las Categorias</Text>
  <Icon
     containerStyle={{marginTop:12,marginLeft:10}}
     name='ios-arrow-round-forward'
     type='ionicon'
     color='black'
     size={34}
     />
  </View>
     <ScrollView>
 {this.props.categories.length>0&&<FlatList data={this.props.categories} keyExtractor={()=>this.messageIdGenerator()} renderItem={({item,index})=>
  <View key={item._id} style={{paddingBottom:10,borderBottomColor:'purple',borderBottomWidth:2,flexDirection:'row'}}>
 <Icon
     containerStyle={{marginTop:12,marginLeft:10}}
          name={item.iconType}
          type={item.iconName}
          onPress={()=>this.NavigateToHome(item.name,item.subCategories)}
          color='darkred'
          size={24}
        />
  <Text onPress={()=>this.NavigateToHome(item.name,item.subCategories)} style={{fontSize:20,marginLeft:10,marginRight:10,paddingTop:10}}>{item.name}</Text>
  </View>
  } 
  />}
  </ScrollView>
    </View>}

    </View>
    )
}
}

function mapStateToProps(state){
    return({
      UID:state.rootReducer.UID,
      categories:state.rootReducer.categories,
      query:state.rootReducer.query
    })
  }
  function mapActionsToProps(dispatch){
    return({
        selectCategory:(category)=>{
            dispatch(selectCategoryAction(category))
        },
        setCategories:(categories)=>{
            dispatch(setCategoriesAction(categories))
        },
        setSubCategories:(sub)=>{
            dispatch(setSubCategoriesAction(sub))
        },
        addtListings:(listingsData)=>{
            dispatch(addtListingsAction(listingsData))
        },
        setQuery:(query)=>{
            dispatch(setQueryAction(query))
        }
    })
  }
  export default connect(mapStateToProps,mapActionsToProps)(MenuDrawer)