import React, { useState, useEffect } from 'react'
import { ImageBackground,StyleSheet, Text, View,TouchableOpacity, Image,Button , Alert, TextInput, BackHandler,Modal,Platform,Dimensions,} from 'react-native'
import { mnemonicToSeed, createAccount, enviarTrans, readMnemonic, getToken, readPublicKey, getBalance } from '../../api';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;
const Importar = ({navigation}: {navigation: any}) => {


    //traer account
    const [pubKey,setPubKey] = useState("")
    const [amounToken,setAmounToken] = useState("")

    //Funcion de obtener splToken
    const [tokenBalance, setTokenBalance] = useState("")

    async function obtenerTokenB(publicKey:string, mint:string) {
        const bala = getToken(publicKey, mint).then((value) => {
        setTokenBalance(value)
        console.log(value)
        })
    }

    const [pKey,setPKey] = useState("")

    readPublicKey().then((val)=>{
        console.log("PUBLIC KEY:");
        console.log(val);
        setPKey(val)
    })

    const [balance, setBalance] = useState(0)

    async function obtenerBalance(publicKey: string) {
        getBalance(publicKey).then((value) => {
        console.log(value)
        setBalance(value)
        }).catch((error) => {
        console.log(error);
        return "error"
        })
    }

    setTimeout(() => {
        obtenerTokenB(pKey,"7TMzmUe9NknkeS3Nxcx6esocgyj8WdKyEMny9myDGDYJ")
        obtenerBalance(pKey)
    }, 1000)
    

    const [anmt,setanmt]= useState("");
    const [MostrarModal, setModal] = useState(false);
    const [MostrarError, setError] = useState("");

    // Nueva funcion de enviar token 
    async function enviarToken(pubKey:string, amount:number) {
        // Verificar si los dos inputs contienen valores
        if (amounToken != '' && pubKey != '') {
            const tengo = Number(tokenBalance)
            const necesito = Number(amounToken)
            // Si lo que deseo enviar es mayor a lo que tengo
            if(tengo < necesito){
                console.log('No tienes CNDR suficiente')
                setError("No tienes CNDR suficiente");
                setModal(true);
                setanmt("fadeInDownBig");
                setTimeout( () => {
                    setanmt("fadeOutUp");
                    setTimeout( () => {
                        setModal(false);
                    }, 100 )
                },2500)  
            } else if(balance == 0){
                console.log('No tienes SOL suficiente');
                setError("No tienes SOL suficiente");
                setModal(true);
                setanmt("fadeInDownBig");
                setTimeout( () => {
                    setanmt("fadeOutUp");
                    setTimeout( () => {
                        setModal(false);
                    }, 100 )
                },2500)  
            }  else {
                const mnemonic = readMnemonic()
                mnemonic.then((value) => {
                    const docePalabras = mnemonicToSeed(value)
                    docePalabras.then((value) => {
                    const acc = createAccount(value)
                        acc.then((value) => {
    
                            enviarTrans(value,pubKey,amount).then((value) => {
                                // La cuenta no ha sido fondeada
                                if (value == 'Error: Failed to find account') {
                                    console.log('Error, la cuenta no ha sido fondeada')
                                    setError("La cuenta no ha sido fondeada");
                                    setModal(true);
                                    setanmt("fadeInDownBig");
                                    setTimeout( () => {
                                        setanmt("fadeOutUp");
                                        setTimeout( () => {
                                            setModal(false);
                                        }, 100 )
                                    },1000)  
                                // La public key ingresada esta paila
                                } else if (value == 'Error: Invalid public key input') {
                                    console.log('Error, la billetera destino no existe')
                                    setError("La billetera destino no existe");
                                    setModal(true);
                                    setanmt("fadeInDownBig");
                                    setTimeout( () => {
                                        setanmt("fadeOutUp");
                                        setTimeout( () => {
                                            setModal(false);
                                        }, 100 )
                                    },2500) 
                                } else if(value == 'Error: Non-base58 character') {
                                    console.log('La direccion no puede contener espacios')
                                    setError("La direccion no puede contener espacios");
                                    setModal(true);
                                    setanmt("fadeInDownBig");
                                    setTimeout( () => {
                                        setanmt("fadeOutUp");
                                        setTimeout( () => {
                                            setModal(false);
                                        }, 100 )
                                    },2000) 
                                } else if(value == 'signature') {
                                    console.log('Transacci??n exitosa')

                                    
                                } else {
                                    console.log('Aqui si ya paso algo muy raro'+value)
                                    setError("Aqui si ya paso algo muy raro");
                                    setModal(true);
                                    setanmt("fadeInDownBig");
                                    setTimeout( () => {
                                        setanmt("fadeOutUp");
                                        setTimeout( () => {
                                            setModal(false);
                                        }, 100 )
                                    },1000) 
                                }
                            })
    
                        })
                    })
                }) 
            }
        // Si alguno de los inputs esta vacio
        } else {
            console.log('Revisa los datos ingresados');
            setError('Revisa los datos ingresados');
            setModal(true);
                setanmt("fadeInDownBig");
                setTimeout( () => {
                    setanmt("fadeOutUp");
                    setTimeout( () => {
                        setModal(false);
                    }, 100 )
                },1000)  
        }
    }

    function setMax() {
        setAmounToken(tokenBalance.toString())
    }


    return (
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}contentContainerStyle={styles.body}
        scrollEnabled={false}>
            <View style={styles.body}>
                <Modal
                    visible={MostrarModal}
                    transparent
                    onRequestClose={() =>
                        setModal(false)
                    }
                    hardwareAccelerated
                >
                    <Animatable.View animation={anmt} duration= {600}>
                        <View style={styles.bodymodal}>
                            <View style={styles.ventanamodal}>
                                <View style={styles.icontext}>
                                    <View style={styles.contenedorlottie}>
                                        <LottieView
                                            style={styles.lottie}
                                            source={require("./Lottie/error.json")}
                                            autoPlay
                                        />
                                    </View>
                                </View>   
                                <View style={styles.textnoti}>
                                    <View style={styles.contenedortext}>
                                            <Text style={styles.texticon}>Error</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.notificacion}>
                                            {MostrarError}                                   
                                            
                                            
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Animatable.View>         
                </Modal>

                <ImageBackground source={require('./img/fondo.png')} style={styles.fondo} >
                    <View style={styles.containeruno}>
                        <Image style={styles.logo} source={require('./img/enviar.png')}  />
                        {/*Boton Depositar */}
                        <View style={styles.cuadroD}>
                            <TouchableOpacity style={styles.btnD}  activeOpacity={1}>
                                <Text style={styles.textbtnD}>ENVIAR</Text> 
                            </TouchableOpacity>
                        </View>                    
                        <View style={styles.cuadro}>
                            {/* Email */}
                            <View style={styles.tablamail} >
                                <View style={styles.cuadromail}>
                                    <TextInput style={styles.inputmail} placeholder="DIRECCI??N: Ezq3cnFnLi3xXxxxXXXxx..." onChangeText={text => setPubKey(text)}/>
                                </View>
                                <View style={styles.cqr}>
                                    <TouchableOpacity style={styles.btnqr}  activeOpacity={0.9} onPress={() => navigation.navigate('QrReader')} >
                                        <Image style={styles.imgqr} source={require('./img/qr.png')}  />
                                    </TouchableOpacity>
                                </View>                      
                            </View>
                            {/*Importe*/}
                            <View style={styles.tablaimp} >
                                <View style={styles.cuadroimp}>
                                    <TextInput style={styles.inputimp} placeholder="IMPORTE" value={amounToken} onChangeText={text => setAmounToken(text)} />
                                </View>
                                <View style={styles.cmax}>
                                    <View style={styles.ccnd}>
                                        <Text>CNDR</Text>
                                    </View>
                                    <View style={styles.cbtnmax}>
                                        <TouchableOpacity style={styles.btnmax} onPress={() => setMax()} activeOpacity={0.9}> 
                                            <Text style={styles.txtmax}>MAX</Text>                        
                                        </TouchableOpacity>
                                    </View>                                
                                </View>                      
                            </View>
                            {/* BotonVolverConfirmar */}
                            <View style={styles.dcVC}>
                                <View style={styles.dcV}>
                                    <TouchableOpacity style={styles.btnVC} activeOpacity={0.9} onPress={() => navigation.navigate('Balance')}>
                                        <Text style={styles.textbtnVC}>VOLVER</Text> 
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dcC}>
                                    <TouchableOpacity style={styles.btnVC}  activeOpacity={0.9} onPress={() => enviarToken(pubKey,Number(amounToken))}>
                                        <Text style={styles.textbtnVC}>CONFIRMAR</Text> 
                                    </TouchableOpacity>  
                                </View>         
                            </View> 
                        </View>
                    </View>             
                </ImageBackground>   
            </View>
        </KeyboardAwareScrollView> 
    )
}

const alturaios = Platform.OS === 'ios' ? '11%' : '2%';
const paddinrightios = Platform.OS === 'ios' ? 15 : 12;
const heightlogo = Platform.OS === 'ios' ? 0.287 : 0.272;
const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    containeruno:{
        paddingTop: '8%',
        paddingLeft: '5%',
        paddingRight: '4%',
        alignItems:'center',
    },
    fondo:{
        flex: 1,
        resizeMode:'contain',
    },
    logo:{
        width: 310,
        height: 250,
        top:'4%',
        resizeMode: 'contain',
    },
    cuadroD:{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginTop: '5%',
        width: '100%'
    },
    btnD:{
        backgroundColor:'transparent',
        alignItems:'center',
        paddingTop: '3%',
        paddingBottom: '3%',
        borderRadius: 20,
    },
    textbtnD:{
        color:'#5b298a',
        fontWeight: 'bold',
        fontSize:RFPercentage(3),
    },
    cuadro:{
        backgroundColor:'white',
        width: '100%',
        height: '100%',
        marginTop: '3%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: '2%',
    },
    tablamail:{
        marginTop:RFValue(25),
        borderWidth: 0.8,
        borderColor: '#e0e0e0',
        borderRadius:10,
        height: '5.8%',
        flexDirection:'row',
        paddingLeft:'2.5%',
        paddingRight:'3.5%',
        paddingTop:'0%'
    },
    cuadromail:{
        width:'80%',
        justifyContent: 'center',
        paddingLeft: '2%'
    },
    inputmail:{
        fontWeight: 'bold',
        fontSize:RFPercentage(1.8),
        color: '#5a5959',
    },
    cqr:{
        width:'20%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    btnqr:{
        backgroundColor:'#5b298a',
        alignItems:'center',
        paddingTop: '12%',
        paddingBottom: '12%',
        paddingLeft: '23%',
        paddingRight: '23%',
        borderRadius: 10,
    },
    imgqr:{
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    tablaimp:{
        marginTop:RFValue(25),
        borderWidth: 0.8,
        borderColor: '#e0e0e0',
        borderRadius:10,
        height: '5.8%',
        flexDirection:'row',
        paddingLeft:'2.5%',
        paddingRight:'3.5%',
        paddingTop:'0%'
    },
    cuadroimp:{
        width:'70%',
        justifyContent: 'center',
        paddingLeft: '2%'
    },
    inputimp:{
        fontWeight: 'bold',
        fontSize:RFPercentage(1.8),
        color: '#5a5959',
    },
    cmax:{
        width:'30%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
    },
    ccnd:{
        width:'50%',
    },
    cbtnmax:{
        width:'50%',
    },
    btnmax:{
        backgroundColor:'#5b298a',
        alignItems:'center',
        paddingTop: '20%',
        paddingBottom: '20%',
        paddingLeft: '10%',
        paddingRight:'10%',
        borderRadius: 10,
    },
    txtmax:{
        color:'white',
        fontWeight: 'bold',
        fontSize:RFPercentage(1.5),
    },
    barcodebox:{
        backgroundColor:'#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
    },
    dcVC:{
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: RFValue(15),
        borderRadius: 10,
        marginTop:RFValue(20)
        
    },
    dcV:{
        width: '50%',
    },
    dcC:{
        width:'50%',
    },
    btnVC:{
        backgroundColor:'#5b298a',
        alignItems:'center',
        marginRight: RFValue(15),
        marginLeft: RFValue(15),
        paddingTop: RFValue(12),
        paddingBottom: RFValue(12),
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.1,
        shadowRadius: 5,

    },
    textbtnVC:{
        color:'white',
        fontWeight: 'bold',
        fontSize:RFValue(11.5),
    },

    //Modal
    bodymodal: {
        flex: 1,
        alignItems: 'center',
    },
    ventanamodal: {
        width: windowWidth*0.95,
        height: windowHeight*0.1,
        backgroundColor: '#5B298A',
        borderWidth: 0.5,
        borderColor: 'white',
        borderRadius: 20,
        paddingLeft:RFValue(12),
        paddingRight:RFValue(12),
        flexDirection: 'row',
        alignItems: 'center',
        top:alturaios
    },
    icontext: {
        alignItems: 'center',
    },
    textnoti: {

    },
    contenedorlottie:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width:60,
        height:60,
    },
    contenedortext: {
        justifyContent: 'center',
    },
    texticon: {
        fontSize:RFValue(18),
        fontWeight: "bold",
        color:'white'
    },
    notificacion:{
        fontSize:RFValue(12),
        color:'white'
    },
})
export default Importar