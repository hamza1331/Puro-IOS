/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, ActivityIndicator, Linking, Platform, Alert,DatePickerAndroid,DatePickerIOS,Keyboard,TouchableWithoutFeedback} from 'react-native';
import { Icon,CheckBox,Header } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown'
import { SafeAreaView } from 'react-navigation'
import { list } from "./countrylist";
import { countries } from "./countries";
import {states} from './States'
import { TextField } from 'react-native-material-textfield'
import {
    widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { connect } from "react-redux";
import { url } from "./Proxy";
class PaymentInfo extends Component {
    constructor(props) {
        super(props)
        this.initialState = {
            first_name: '',
            last_name: '',
            uploading: false,
            userData: null,
            showIndividual: true,
            showBusiness: false,
            type: 'Individual',
            email:'',
            line1:'',
            line2:'',
            city:'',
            country:'MX',
            postal_code:'',
            state:'Distrito Federal',
            dob:new Date(),
            phone:'',
            ssn:'',
            mcc:"5045",
            businesweb:'https://www.facebook.com/My-Consignment-380280215902246/?view_public_for=380280215902246',
            gender:'Male',
            chosenDate: new Date(),
            taxId:'',
            name:'',
            allow:true,
            stateData:[],
            stateNames:[],
            accountID:'',
            disabled:false,
            countryData:[],
            selectedCountry:"",
            selectedStates:[],
            statecode:'',
            countryCode:'',
            showDate:false,
            finalDate:''
            }
        this.state = {
            ...this.initialState
        }
        this.showIndividualForm=this.showIndividualForm.bind(this)
        this.showBusinessForm=this.showBusinessForm.bind(this)
        this.openDatePickerAndroid=this.openDatePickerAndroid.bind(this)
        this.setDate=this.setDate.bind(this)
        this.uploadData=this.uploadData.bind(this)
        this.fetchData=this.fetchData.bind(this)
        this._goToURL=this._goToURL.bind(this)
    }
    _goToURL() {
        const url = 'https://www.dm.usda.gov/procurement/card/card_x/mcc.pdf'
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            console.log('Don\'t know how to open URI: ' + url);
          }
        });
       
      }
    showBusinessForm() {
        this.setState({
            showBusiness: true,
            showIndividual: false,
            type: "Business"
        })
    }
   
    setDate(newDate) {
        let dateString = newDate.toString()
        let months = [" ", "Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        let today = dateString.split(' ')
        let year = today[3]
        let day = today[2]
        let month = months.indexOf(today[1])
        
        let finalDate = month+'/'+day+"/"+year
        this.setState({dob: newDate,finalDate});
      }
   async openDatePickerAndroid(){
        try {
            let {action, year, month, day} = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date(1990, 0, 1),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              // Selected year, month (0-11), day

              let m = ++month
              let dob = ''+m.toString()+'/'+day.toString()+'/'+year.toString()
              this.setState({
                  dob
              })
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }
    }
    showIndividualForm() {
        this.setState({
            showBusiness: false,
            showIndividual: true,
            type: "Individual"
        })
    }
    componentDidMount() {
        let countryData = countries.map(country=>{
            return{
                value:country.name
            }
        })
        this.setState({countryData})
        AsyncStorage.getItem('userData').then(response => {
            if (response !== null) {
                let user = JSON.parse(response)
                this.setState({
                    userData: user,
                    email:user.email,
                    selectedCountry:user.country
                })
                let countrystates = list.filter(country=>{
                    if(country.name===user.country){
                        return country.states
                    }
                })
                let selectedStates = countrystates[0].states.map(state=>{
                    return{
                        value:state.name
                    }
                })
                this.setState({selectedStates,state:selectedStates[0].value})
                let names = user.fName.split(' ')
                if(names.length>1){
                    this.setState({
                        first_name:names[0],
                        last_name:names[1]
                    })
                }
                else if(names.length===1){
                    this.setState({
                        first_name:names[0]
                    })
                }
            }
        })
        AsyncStorage.getItem('paymentinfo')
        .then(res=>{
            if(res!==null&&res==='true'){
                    this.setState({
                        disabled:true
                    })
                    console.log(this.state.disabled)
            }
        })
        
        let stateData = states.map(state=>{
            return{
                value:state.value
            }
        })
        let stateNames = states.map(state=>state.value)
        this.setState({
            stateData,
            stateNames
        })
        this.fetchData()
    }
    fetchData=()=>{
        fetch(url+'/api/getPaymentInfo'+this.props.UID)
        .then(res=>res.json())
        .then(data=>{
           if(data.message==='Success'){
            if(data.doc!==null)
            {
                let paymentProfile = data.doc
           let dob = ''+paymentProfile.dob.month+'/'+paymentProfile.dob.day+'/'+paymentProfile.dob.year
           this.setState({
               showIndividual:true,
               type:paymentProfile.businessType,
               first_name:paymentProfile.first_name,
               last_name:paymentProfile.last_name,
               gender:paymentProfile.gender,
               ssn:paymentProfile.ssn,
               email:paymentProfile.email,
               phone:paymentProfile.phone,
               country:paymentProfile.address.country,
               line1:paymentProfile.address.line1,
               city:paymentProfile.address.city,
               postal_code:paymentProfile.address.postal_code.toString(),
               accountID:paymentProfile.accountID,
               chosenDate:dob
           })
            }
           }
        })
    }
    uploadData(){
        this.setState({uploading:true,disabled:true})
        if(this.state.showIndividual && this.state.disabled===false){
            
                let {
                first_name,last_name,email,gender,phone,ssn,
                line1,postal_code,city,countryCode,statecode,businesweb,mcc,type
                } = this.state
                let g = gender==='Male'?'male':'female'
                let data = {
                    first_name,last_name,email,gender:g,phone,ssn,
                    line1,state:statecode,postal_code,city,country:countryCode,dob:this.state.finalDate,businesweb,mcc,type,
                    firebaseUID:this.props.UID
                }
                console.log('Payment Info ',data)
                fetch(url+'/createacc',{method:"POST",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
                .then(res=>res.json())
                .then(data=>{
                    this.setState({
                        uploading:false,
                        disabled:false
                    })
                    if(data.message==='Failed')
                    {
                        Alert.alert("Ha fallado",'Rellene todos los campos requeridos!')
                        this.setState({
                            uploading:false,
                            disabled:false
                        })
                    }
                    else if(data.message==='Success'){
                        Alert.alert('Hecho',"Información de pago completada!")
                        this.props.navigation.navigate('BankDetails')
                    }
                })
                
        }
        else{
            let data = this.state
        }
    }
    render() {
        const Options = [{
            value: 'Masculino'
        }, {
            value: 'Hembra'
        }
        ]

        return (
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'none'}  
                           style={{ flex: 1 }}
            >

            <SafeAreaView style={{ flex: 1 }}>
             
       <Header
       backgroundColor='#F3F3F2'
           placement="left"
                  centerComponent={{alignItems:'center', text: 'Información de Pago', style: { color: '#4d2600',fontSize:22} }}
                  rightContainerStyle={{flexBasis:'30%',alignItems:'center'}}
                  collapsable={true}
                  leftContainerStyle={{alignItems:'center'}}
                  leftComponent={
                    <Icon  
                    name="ios-menu"
                    type="ionicon"
                    color="darkred"
                    size={Platform.OS==='ios'?30:40}
                     onPress={(e)=>{this.props.navigation.toggleDrawer(e)}}
                    />
                    }
                    rightComponent={
                        <Text onPress={()=>this.props.navigation.navigate("BankDetails")} style={{fontSize:16,color:'darkred',textDecorationLine:'underline',fontWeight:'bold'}}>Detalles del Banco</Text>
                    }
                  />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <View style={{flex:1,justifyContent:'center',marginTop:3}}>
                    {this.props.paymentInfo===null &&<Text style={{fontSize:16,fontWeight:'bold',textAlign:'center'}}>Envíe su información de pago para crear una cuenta de Stripe Connect que permita recibir pagos.</Text>}
                    {this.props.paymentInfo!==null &&<Text style={{fontSize:16,fontWeight:'bold',textAlign:'center'}}>Debe contactarnos para actualizar sus datos.</Text>}
                    </View>
                    <View style={{ width: '100%', height: hp('9%'), backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, color: 'gray', fontSize: 15, fontWeight: 'bold' }}>Seleccionar Negocio Tipo</Text>
                    </View>
                    <View style={{ width: '100%', height: hp('11%'), backgroundColor: 'white', flexDirection: 'row' }}>
                        <CheckBox
                            title='Individual'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.showIndividual}
                            onPress={this.showIndividualForm}
                            checkedColor='darkred'
                            containerStyle={{ marginLeft: 25, backgroundColor: 'white', borderWidth: 0 }}
                        />
                        <CheckBox
                            center
                            title='Negocio'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.showBusiness}
                            onPress={this.showBusinessForm}
                            containerStyle={{ marginLeft: 25, backgroundColor: 'white', borderWidth: 0 }}
                            checkedColor='darkred'
                        />
                    </View>
                    {this.state.showIndividual && <View style={{ marginTop: 5 }}>
                    <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, color: 'gray', fontSize: 15, fontWeight: 'bold' }}>Información Personal</Text>
                    </View>
                        <KeyboardAvoidingView>
                            <TextField
                                label='Nombre de Pila'
                                value={this.state.first_name}
                                onChangeText={(first_name) => this.setState({ first_name })}
                                tintColor="darkred"
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView>
                            <TextField
                                label='Apellido'
                                value={this.state.last_name}
                                onChangeText={(last_name) => this.setState({ last_name })}
                                tintColor="darkred"
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView>
                            <TextField
                                label='Email'
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                                tintColor="darkred"
                                keyboardType='email-address'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                        {Platform.OS==='android'&&<KeyboardAvoidingView>
                            <TextField
                                label='Fecha de Nacimiento'
                                value={this.state.dob}
                                onTouchEnd={this.openDatePickerAndroid}
                                tintColor="darkred"
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>}
                        {Platform.OS==='ios'&&this.state.showDate===false && <KeyboardAvoidingView>
                            <TextField
                                label='Fecha de Nacimiento'
                                value={this.state.chosenDate}
                                onTouchEnd={()=>{this.setState({showDate:true})}}
                                tintColor="darkred"
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>}
                        {Platform.OS==='ios' && this.state.showDate===true && <KeyboardAvoidingView>
                        <DatePickerIOS
                        date={this.state.dob}
                        mode='date'
                        onDateChange={this.setDate}
                        />
                        </KeyboardAvoidingView>
                        }
                        <View style={{ marginLeft: 7, marginTop: 7, flexDirection: 'row' }}>
                            <View style={{ flexBasis: '80%' }}>
                                <Dropdown containerStyle={{ marginLeft: 3, marginRight: 8, width: '100%', }}
                                    label='Gender'
                                    itemTextStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    value={this.state.gender}
                                    data={Options}
                                    onChangeText={text => this.setState({ option: text })}
                                />
                            </View>
                        </View>
                    <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, color: 'gray', fontSize: 15, fontWeight: 'bold' }}>Address Info</Text>
                    </View>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Line 1'
                                value={this.state.line1}
                                onChangeText={(line1) => this.setState({ line1 })}
                                tintColor="darkred"
                                placeholder='Calle, PO BOX o Empresa'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                                characterRestriction={600}
                            />
                        </KeyboardAvoidingView>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Line 2'
                                value={this.state.line2}
                                onChangeText={(line2) => this.setState({ line2 })}
                                tintColor="darkred"
                                placeholder='Apartamento, Suite o Edificio'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                                characterRestriction={600}
                            />
                        </KeyboardAvoidingView>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Código postal'
                                value={this.state.postal_code}
                                onChangeText={(postal_code) => this.setState({ postal_code })}
                                tintColor="darkred"
                                keyboardType='number-pad'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                        <View style={{ marginLeft: 10, marginTop: 7, flexDirection: 'row' }}>
                            <View style={{ flexBasis: '80%' }}>
                                <Dropdown containerStyle={{ marginLeft: 3, marginRight: 8, width: '100%',alignSelf:'center' }}
                                    label='País'
                                    itemTextStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    value={this.state.selectedCountry}
                                    data={this.state.countryData}
                                    onChangeText={text => {
                                        let countrystates = list.filter(country=>{
                                            if(country.name===text){
                                                return country.states
                                            }
                                        })
                                        let countryCode = countrystates[0].code2
                                        let selectedStates = countrystates[0].states.map(state=>{
                                            return{
                                                value:state.name
                                            }
                                        })
                                        this.setState({selectedStates, selectedCountry: text,state:selectedStates[0].value,countryCode })
                                    }}
                                />
                            </View>
                        </View>
                        {this.state.selectedStates.length>0 && <View style={{ marginLeft: 7, marginTop: 7, flexDirection: 'row' }}>
                            <View style={{ flexBasis: '80%' }}>
                                <Dropdown containerStyle={{ marginLeft: 3, marginRight: 8, width: '100%' }}
                                    label='Estado'
                                    itemTextStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    value={this.state.state}
                                    data={this.state.selectedStates}
                                    onChangeText={text => {
                                        this.setState({ state: text })
                                        let countrystates = list.filter(country=>{
                                            if(country.name===this.state.selectedCountry){
                                                return country.states
                                            }
                                        })
                                        let states = countrystates[0]
                                        let selectedState = states.states.filter(st=>st.name===text)
                                        let statecode = selectedState[0].code
                                        this.setState({statecode})

                                    }}
                                />
                            </View>
                        </View>}
                        <KeyboardAvoidingView>
                            <TextField
                                label='Ciudad'
                                value={this.state.city}
                                onChangeText={(city) => this.setState({ city })}
                                tintColor="darkred"
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Teléfono móvil'
                                value={this.state.phone}
                                onChangeText={(phone) => this.setState({ phone })}
                                tintColor="darkred"
                                keyboardType='phone-pad'
                                placeholder='+15551234567'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                     <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, color: 'gray', fontSize: 15, fontWeight: 'bold' }}>Detalles de Verificación</Text>
                    </View>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Número de seguridad social'
                                value={this.state.ssn}
                                onChangeText={(ssn) => this.setState({ ssn })}
                                tintColor="darkred"
                                keyboardType='number-pad'
                                placeholder='001234567'
                                secureTextEntry={true}
                                maxLength={9}
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                    </View>}
                   {this.state.showBusiness && <View style={{ marginTop: 5 }}>
                    <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, color: 'gray', fontSize: 15, fontWeight: 'bold' }}>Personal Info</Text>
                    </View>
                        <KeyboardAvoidingView>
                            <TextField
                                label='Nombre'
                                value={this.state.name}
                                onChangeText={(name) => this.setState({ name })}
                                tintColor="darkred"
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                      
                    <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, color: 'gray', fontSize: 15, fontWeight: 'bold' }}>Address Info</Text>
                    </View>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Line 1'
                                value={this.state.line1}
                                onChangeText={(line1) => this.setState({ line1 })}
                                tintColor="darkred"
                                placeholder='Calle, PO BOX o Empresa'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                                characterRestriction={600}
                            />
                        </KeyboardAvoidingView>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Line 2'
                                value={this.state.line2}
                                onChangeText={(line2) => this.setState({ line2 })}
                                tintColor="darkred"
                                placeholder='Apartamento, Suite o Edificio'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                                characterRestriction={600}
                            />
                        </KeyboardAvoidingView>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Código Postal'
                                value={this.state.postal_code}
                                onChangeText={(postal_code) => this.setState({ postal_code })}
                                tintColor="darkred"
                                keyboardType='number-pad'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                        <View style={{ marginLeft: 10, marginTop: 7, flexDirection: 'row' }}>
                            <View style={{ flexBasis: '80%' }}>
                                <Dropdown containerStyle={{ marginLeft: 3, marginRight: 8, width: '100%',alignSelf:'center' }}
                                    label='País'
                                    itemTextStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    value={this.state.selectedCountry}
                                    data={this.state.countryData}
                                    onChangeText={text => {
                                        let countrystates = list.filter(country=>{
                                            if(country.name===text){
                                                return country.states
                                            }
                                        })
                                        let countryCode = countrystates[0].code2
                                        let selectedStates = countrystates[0].states.map(state=>{
                                            return{
                                                value:state.name
                                            }
                                        })
                                        this.setState({selectedStates, selectedCountry: text,state:selectedStates[0].value,countryCode })
                                    }}
                                />
                            </View>
                        </View>
                        {this.state.selectedStates.length>0 && <View style={{ marginLeft: 7, marginTop: 7, flexDirection: 'row' }}>
                            <View style={{ flexBasis: '80%' }}>
                                <Dropdown containerStyle={{ marginLeft: 3, marginRight: 8, width: '100%', }}
                                    label='Estado'
                                    itemTextStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    value={this.state.state}
                                    data={this.state.selectedStates}
                                    onChangeText={text => {
                                        this.setState({ state: text })
                                        let countrystates = list.filter(country=>{
                                            if(country.name===this.state.selectedCountry){
                                                return country.states
                                            }
                                        })
                                        let states = countrystates[0]
                                        let selectedState = states.states.filter(st=>st.name===text)
                                        let statecode = selectedState[0].code
                                        this.setState({statecode})

                                    }}
                                />
                            </View>
                        </View>}
                        <KeyboardAvoidingView>
                            <TextField
                                label='Ciudad'
                                value={this.state.city}
                                onChangeText={(city) => this.setState({ city })}
                                tintColor="darkred"
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Móvil'
                                value={this.state.phone}
                                onChangeText={(phone) => this.setState({ phone })}
                                tintColor="darkred"
                                keyboardType='number-pad'
                                placeholder='+15551234567'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                     <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, color: 'gray', fontSize: 15, fontWeight: 'bold' }}>Detalles de verificación</Text>
                    </View>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Impuesto ID'
                                value={this.state.taxId}
                                onChangeText={(taxId) => this.setState({ taxId })}
                                tintColor="darkred"
                                placeholder='00-0000000'
                                maxLength={10}
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView>
                   
                        <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, color: 'gray', fontSize: 15, fontWeight: 'bold' }}>Detalles comerciales</Text>
                    </View>
                        <KeyboardAvoidingView>
                            <TextField
                                label='Información del Negocio'
                                value={this.state.businesweb}
                                onChangeText={(businesweb) => this.setState({ businesweb })}
                                tintColor="darkred"
                                keyboardType='url'
                                placeholder='Enlace web o perfil social'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                            />
                        </KeyboardAvoidingView> 
                    </View>}
                    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                        <TouchableOpacity disabled={this.state.disabled} onPress={this.uploadData} style={{ width: wp('90%'), height: hp('5%'), backgroundColor: this.state.disabled===true?'gray':'darkred', borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                            {this.state.uploading === false && <Text style={{ color: 'white', fontSize: 20 }}>GUARDAR</Text>}
                            {this.state.uploading === true && <ActivityIndicator size={20} animating color='white' />}
                        </TouchableOpacity>
                    </View>
                </ScrollView>


            </TouchableWithoutFeedback>

            </SafeAreaView>
            </KeyboardAvoidingView>

        )
    }
}
function mapStateToProps(state) {
    return ({
        UID: state.rootReducer.UID,
        paymentInfo:state.rootReducer.paymentInfo
    })
}
function mapActionsToProps(dispatch) {
    return ({

    })
}
export default connect(mapStateToProps, mapActionsToProps)(PaymentInfo)
