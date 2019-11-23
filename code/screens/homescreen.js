import React, {Component} from 'react';
import {StyleSheet, Text, View,FlatList,Platform,ActivityIndicator,AsyncStorage,ScrollView,Alert} from 'react-native';
import {Header,Button,Input,Icon} from 'react-native-elements';
import Modals from '../screens/modalforlisting'
import SubModal from '../screens/SubcategoriesModal'
import CardDesp from '../screens/cardDescription'
import { SafeAreaView } from "react-navigation";
import { showListingCategoriesAction,renderItemAction,addtListingsAction,showDescriptionModalAction,setFavoriteIdsAction,setQueryAction,setPaymentInfoAction } from "../store/actions/actions";
import { connect } from "react-redux";
import { url } from "./Proxy";
import firebase from 'react-native-firebase';
import { Card, CardTitle, CardContent, CardAction, CardImage } from 'react-native-material-cards'
class HomeScreen extends Component {
    constructor(props){
      super(props);
      this.state={
        cat:'Artisan',
        categories:['Household','Children','Jewelry','Art','Entertainment','Gifts','Crafts'],
        ismodalVisible:false,
        isCatModal:false,
        showScroll:true,
        data:[],
        avatarSource: null,
        videoSource: null,
        page:1,
        loadingMore:false,
        refreshing:false,
        endOfData:false,
        totalPages:2,
        searchText:'',
        user:null,
        allowListing:false,
        loading:false
      }
      this.fetchListings=this.fetchListings.bind(this)
      this.handleRefresh=this.handleRefresh.bind(this)
      this._handleLoadMore=this._handleLoadMore.bind(this)
      this.handleSearch=this.handleSearch.bind(this)
      this.generateToken=this.generateToken.bind(this)
      this.onEndReachedCalledDuringMomentum = true;
    }
  
    handleCategoryClick=(value)=>{
      this.setState({
        cat:value,
        loading:true
      })
      let data = {
        Category:this.props.selectedCategory,
        subCategory:value
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
            // this.props.navigation.navigate('HomeScreen')
          }).catch(err=>console.log(err))
    }
    _handleLoadMore = () => {

      if(!this.onEndReachedCalledDuringMomentum && this.state.searchText.length===0){

        if(this.state.page===this.state.totalPages)
        return
        this.setState(
          (prevState, nextProps) => ({
            page: prevState.page + 1,
            loadingMore: true
          }),
          () => {
            this.fetchListings();
          }
          );
          this.onEndReachedCalledDuringMomentum = true;
        }
        };
    fetchListings(){
      const {page} = this.state
     if(this.props.query===null){
      fetch(url+'/api/getListings'+page,{method:"POST",headers: { "Content-Type": "application/json" }}).then((res)=>res.json()).then((data)=>{
        if(page===1){
            if(data.data.length===0||page===data.pages-1)
            {
              this.setState({
                endOfData:true,
                loadingMore:false
              })
              return
            }
            this.props.addtListings({
              page:this.state.page,
              listings:data.data
            })
 
            this.setState({
              loadingMore:false,
              refreshing:false,
              totalPages:data.pages
            })
          }
          else{
            if(data.data.length===0||page===data.pages)
            {
              this.setState({
                endOfData:true,
                loadingMore:false
              })
      }    
 
            let listings = data.data
            this.props.addtListings({
              page:this.state.page,
              listings
             })
           
            this.setState({
              loadingMore:false,
            })
          }
        })
     }
     else if(this.props.query!==null){
      fetch(url+'/api/getListings'+this.state.page,{body:JSON.stringify(this.props.query),method:"POST",headers: { "Content-Type": "application/json" }}).then((res)=>res.json()).then((data)=>{
        if(page===1){
            if(data.data.length===0||this.state.page===data.pages-1)
            {
              this.setState({
                endOfData:true,
                loadingMore:false
              })
              return
            }
            this.props.addtListings({
              page:this.state.page,
              listings:data.data
            })
 
            this.setState({
              loadingMore:false,
              refreshing:false,
              totalPages:data.pages
            })
          }
          else{
            if(data.data.length===0||this.state.page===data.pages)
            {
              this.setState({
                endOfData:true,
                loadingMore:false
              })
      }    
 
            let listings = data.data
            this.props.addtListings({
              page:this.state.page,
              listings
             })
           
            this.setState({
              loadingMore:false,
            })
          }
        })
     }
    }
    handleSearch(){
      if(this.state.searchText.length>1){
        let data = {
          title:this.state.searchText
        }
        fetch(url+'/api/searchListing',{method:"PUT",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
        .then(res=>res.json()).then(listings=>{
          if(listings.length>0){
            this.props.addtListings({
              page:1,
              listings
            })
          }
        }).catch(err=>console.log(err))
      }
    }
    handleRefresh(){
      this.setState({
        loadingMore:true,
        page:1,
        refreshing:true,
        endOfData:false
      })

      fetch(url+'/api/getListings'+this.state.page,{method:"POST",headers: { "Content-Type": "application/json" }}).then((res)=>res.json()).then((data)=>{
        if(this.state.page===1){
          if(data.data.length===0)
        {
          this.setState({
            endOfData:true,
            loadingMore:false,
            refreshing:false
          })
          return
        }
        this.props.addtListings({
          page:this.state.page,
          listings:data.data
        })
        
          this.setState({
            loadingMore:false,
            refreshing:false
          })
        }

      })
    }
   async componentDidMount(){
      this.checkPermission();
      this.createNotificationListeners(); //add this line
      fetch(url+'/api/getPaymentInfo'+this.props.UID)
      .then(res=>res.json())
      .then(response=>{
        if(response.message==='Success'){
        AsyncStorage.setItem('paymentinfo','true')
        this.props.setPaymentInfo(response.doc)
        this.setState({
          allowListing:true
        })
        }
        else if(response.message==='Failed'){
          this.setState({
            allowListing:false
          })
        }
      })
      this.fetchListings()
      fetch(url+'/api/getFavoriteIds'+this.props.UID)
      .then(res=>res.json())
      .then(data=>{
        if(data.message==="Success"){
          if(data.docs.Favorites)
          this.props.setFavoriteIds(data.docs.Favorites)
        }
      })
    }
    async checkPermission() {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
        this.getToken();
      } else {
        this.requestPermission();
      }
    }
    componentWillUnmount() {
      this.notificationListener;
      this.notificationOpenedListener;
    }
    async createNotificationListeners() {
      /*
      * Triggered when a particular notification has been received in foreground
      * */
      this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        console.log('onNotification:');
        // Alert.alert(title,body)
        // alert('message');
  
        const localNotification = new firebase.notifications.Notification({
          sound: 'sampleaudio',
          show_in_foreground: true,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          // .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          // .setData(notification.data)
          .android.setChannelId('fcm_default_channel') // e.g. the id you chose above
          .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
          .android.setColor('#000000') // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);
          
  
        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      });
  
  
      const channel = new firebase.notifications.Android.Channel('fcm_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
        .setDescription('Demo app description')
        .setSound('sampleaudio.mp3');
      firebase.notifications().android.createChannel(channel);
  
      /*
      * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
      * */
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        console.log('onNotificationOpened:');
        this.props.navigation.navigate('Conversations')
      });
  
      /*
      * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
      * */
      const notificationOpen = await firebase.notifications().getInitialNotification();
      if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.props.navigation.navigate('Conversations')
      }
      /*
      * Triggered for data only payload in foreground
      * */
      this.messageListener = firebase.messaging().onMessage((message) => {
        //process data message
        console.log(JSON.stringify(message));
      });
    }
  
    //3
    async generateToken(){
      let Token =  await firebase.messaging().getToken();
      if (Token) {
        // user has a device token
        console.log(Token)
        let data = {
          firebaseUID:this.props.UID,
          token:Token
        }
        fetch(url+'/api/addToken',{method:"PUT",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
          .then(res=>res.json())
          .then(response=>{
            console.log(response)
            AsyncStorage.setItem('fcmToken', Token);
          })
    }
  }
    async getToken() {
     await AsyncStorage.getItem('fcmToken').then(data=>{
      if(data===null){
        this.generateToken()
      }
      else
      console.log(data)
    })
    }
  
    //2
    async requestPermission() {
      try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
      } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
      }
    }
    _toggleModal = () =>
    this.setState({ ismodalVisible: !this.state.ismodalVisible });

    _toggleDespModal = ()=>this.setState({showDespModal:true})
    _toggleDespCloseModal = ()=>this.setState({showDespModal:false})
    
    render() {
      if (this.state.loading) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={30} color='darkred' animating />
          </View>
        );
      }  
      else return (
        <SafeAreaView style={styles.container}>
        
      <Header leftContainerStyle={{flexBasis:'10%',marginBottom:18}}  centerContainerStyle={{flexBasis:"70%",alignItems:"center"}} rightContainerStyle={{flexBasis:'20%'}}
      collapsable={true}
      leftComponent={
        <Icon  
        name="ios-menu"
        type="ionicon"
        color="#4d2600"
        size={Platform.OS==='ios'?30:40}
         onPress={(e)=>{this.props.navigation.toggleDrawer(e)}}
        />
          }
          centerComponent={
            this.props.selectedCategory===''? <Input 
            onChangeText={text=>this.setState({searchText:text})}
            returnKeyType='search'
            onSubmitEditing={this.handleSearch}
           leftIcon={
             <Icon 
             name='ios-search'
                     type='ionicon'
                     color='gray'
             />
           }
             placeholder={'Buscar Puro Artesanal'}
             shake={true}
             inputContainerStyle={{width:"100%",backgroundColor:'white',borderRadius:12,borderBottomColor:'white'}}
             containerStyle={{height:45,flex:1,alignItems:'center'}}
             rightIcon={
               this.state.searchText.length>0&&<Icon
               name='clear'
               type='material'
               color='darkred'
               />
             }
           />:
           <Input 
            onChangeText={text=>this.setState({searchText:text})}
            returnKeyType='search'
            onSubmitEditing={this.handleSearch}
           leftIcon={
             <Icon 
             name='ios-search'
                     type='ionicon'
                     color='gray'
             />
           }
             placeholder={`Buscar ${this.props.selectedCategory}`}
             shake={true}
             inputContainerStyle={{width:"100%",backgroundColor:'white',borderRadius:12,borderBottomColor:'white'}}
             containerStyle={{marginBottom:23,height:45,flex:1,alignItems:'center'}}
             rightIcon={
              this.state.searchText.length>0 &&  <Icon
              name='clear'
              type='material'
              color='darkred'
              onPress={()=>this.setState({searchText:''})}
              />
             }
           />
          }
          rightComponent={
            <Text onPress={()=>this.props.navigation.navigate("Filter")} style={{fontSize:20,color:'brown'}}>Filtrar</Text>
        
       }
       containerStyle={{backgroundColor:'#F3F3F2',opacity:0.8
      }}
       />

  {this.props.selectedCategory!=='' && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height:20,borderBottomColor:'#804103',borderBottomWidth:1}}>
  {this.props.subCategories.length>0 && this.props.subCategories.map((subcat)=>{
    return <View style={{marginLeft:5,justifyContent:'center',alignItems:'center'}}>
    <Icon
            reverse
            name={subcat.iconType}
            type={subcat.iconName}
            color='#4d2600'
            onPress={()=>this.handleCategoryClick(subcat.name)}      
             />
      <Text  style={{textAlign:'center',color:'black',fontWeight:'bold'}}>{subcat.name}</Text>
    </View>
  })}
  
  </ScrollView>} 
  
  <View style={{flex:8,marginTop:5,justifyContent:'space-evenly'}}>
  {this.props.listings.length>0&&  <FlatList
      onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          numColumns={2}
         onEndReached={this._handleLoadMore}
         onEndReachedThreshold={0.5}
         initialNumToRender={20}
         onRefresh={this.handleRefresh}
         data={this.props.listings}
         refreshing={this.state.refreshing}
         keyExtractor={item => item._id.toString()}
         renderItem={({ item,index }) => {
          return <View 
          style={{width:'50%',borderRadius:12}}>
          <Card>
  <CardImage 
    source={{uri:item.imageLinks[0]}} 
    width="300"
    height="500"
  />
  <CardTitle 
    title={item.title}
   />
  <CardContent text={item.description.substring(0,100)} />
  <CardAction 
    separator={true} 
    inColumn={false}>
  
   <Button
         containerStyle={{marginBottom:7,marginTop:7,marginLeft:50,width:'50%'}}
            raised
            onPress={()=>{
              this.setState({loading:true})
              fetch(url+'/api/getListing'+item._id).then(res=>res.json()).then(data=>{
                let Favorites = this.props.Favorites
                if(Favorites.includes(item._id)==true){
                  AsyncStorage.setItem('favorite','true')
                }
                else{
                  AsyncStorage.setItem('favorite','false')
                }
                this.props.renderItem(data.result)
                this.setState({loading:false})
                this.props.showDescriptionModal()
            })
            }}
            buttonStyle={{borderRadius: 9, marginLeft: 0, marginRight: 0, marginBottom:0,backgroundColor:'#804103'}}
            title='VER' 
            />
  </CardAction>
</Card>
          {/* <Card 
          dividerStyle={{marginTop:10}}
          title={item.title} titleStyle={{color:'#804103'}} containerStyle={{borderRadius:12,height:450,opacity:0.8}} imageStyle={{height:110}} image={{uri:item.imageLinks[0]}}>
          <Text style={{marginBottom: 10,height:170}}>
          {item.description.substring(0,100)}
          </Text>
          <View style={{alignContent:'flex-end'}}>
          <Button
            raised
            onPress={()=>{
              fetch(url+'/api/getListing'+item._id).then(res=>res.json()).then(data=>{
                this.props.renderItem(data.result)
                console.log(data.result)
                this.props.showDescriptionModal()
            })
            }}
            containerStyle={{marginTop:70}}
            buttonStyle={{borderRadius: 9, marginLeft: 0, marginRight: 0, marginBottom: 0,backgroundColor:'#804103'}}
            title='VIEW' 
            />
            </View>
        </Card> */}
        </View>
         }}
       />}
       {this.state.endOfData && <Text>**Fin de los Listados**</Text>}
       {this.state.loadingMore===true && <ActivityIndicator size={14} animating/>}

</View>
 {/* <GridLayout
            items={this.state.data}
            itemsPerRow={2}
            renderItem={this.renderGridItem}
          /> */}

  {/* <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.clickHandler}
            style={styles.TouchableOpacityStyle}>
        <Text style={{color:'white',padding:10,fontSize:20}} onPress={this._toggleCatModal}>+ListItems</Text>
          </TouchableOpacity> */}
          <View style={{alignItems:'center'}}>
          <View style={{position: 'absolute',
      width:180,
      height:40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#D1802E',
      borderRadius:12,
      bottom:'20%',
      marginBottom:25
      }}>
            <Button title="+Agregar Listado" onPress={()=>{
              if(this.state.allowListing===false){
                Alert.alert(
                  'Advertencia',
                  'Debe completar su información de pago para recibir pagos ...',
                  [
                    {text: 'De todas maneras, continúe', onPress: () => {
                      this.props.showListingCategories()
                    }, style: 'cancel'},
                    {text: 'Si, Preparar Perfil', onPress: () => {
                      this.props.navigation.navigate('PaymentInfo')
                    } },
                  ]
                );
              }
              else{
                this.props.showListingCategories()
              }
              }} buttonStyle={{backgroundColor:'#D1802E',height:40}}/>
          </View>
          </View>
          <CardDesp navigation={this.props.navigation} />
          <Modals navigation={this.props.navigation}/>
          <SubModal navigation={this.props.navigation}/>
        </SafeAreaView>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#F3F3F2',
    },
    TouchableOpacityStyle: {
      position: 'absolute',
      width:140,
      height:40,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: '10%',
      backgroundColor:'purple',
      borderRadius:12
    },
  });
  function mapStateToProps(state){
    return({
      UID:state.rootReducer.UID,
      listings:state.rootReducer.data,
      query:state.rootReducer.query,
      selectedCategory:state.rootReducer.selectedCategory,
      Favorites:state.rootReducer.Favorites,
      subCategories:state.rootReducer.subCategories
    })
  }
  function mapActionsToProps(dispatch){
    return({
        showListingCategories:()=>{
          dispatch(showListingCategoriesAction())
        },
        renderItem:(item)=>{
          dispatch(renderItemAction(item))
        },
        addtListings:(listingsData)=>{
          dispatch(addtListingsAction(listingsData))
        },
        showDescriptionModal:()=>{
          dispatch(showDescriptionModalAction())
        },
        setFavoriteIds:(ids)=>{
          dispatch(setFavoriteIdsAction(ids))
        },
        setQuery:(query)=>{
            dispatch(setQueryAction(query))
        },
        setPaymentInfo:(info)=>{
          dispatch(setPaymentInfoAction(info))
        }
    })
  }
export default connect(mapStateToProps,mapActionsToProps)(HomeScreen)