import { 
    login,
    logout,
    selectCategory,
    showListingCategoriesMOdal,
    hideListingCategoriesMOdal,
    setUID,
    renderItem,
    setChatData,
    addtListings,
    showDescriptionModal,
    hideDescriptionModal,
    setQuery,
    setFavoriteIds,
    setSubCategories,
    setShippingProfile,
    setShippings,
    selectShipping,
    showOrderModal,
    hideOrderModal,
    renderOrder,
    setCategories,
    showSubCategoriesMOdal,
    hideSubCategoriesMOdal,
    setSubCategoriesForListing,
    setSubCategory,
    setPaymentInfo
} from "../actions/actionNames";
const initialState = {
    isLoggedIn:false,
    userName:'',
    selectedCategory:'',
    showListingCategories:false,
    UID:'',
    item:null,
    chatData:null,
    data:[],
    showDescription:false,
    query:null,
    Favorites:[],
    subCategories:[],
    shippingProfile:null,
    shippings:[],
    selectedShipping:null,
    order:null,
    showOrder:false,
    categories:[],
    showSubCategories:false,
    selectedSubCategory:'',
    paymentInfo:null
}

export default (state = initialState,action)=>{
    switch(action.type){
        case login:
        return{
            ...state,
            isLoggedIn:true,
            userName:action.payload
        }
        case logout:
        return {
            ...state,
            isLoggedIn:false,
            userName:''
        }
        case selectCategory:
        return{
            ...state,
            selectedCategory:action.payload
        }
        case showListingCategoriesMOdal:
        return{
            ...state,
            showListingCategories:true
        }
        case hideListingCategoriesMOdal:

        return{
            ...state,
            showListingCategories:false
        }
        case setUID:
        return{
            ...state,
            UID:action.payload
        }
        case renderItem:
        return{
            ...state,
            item:action.payload
        }
        case setChatData:
        return{
            ...state,
            chatData:action.payload
        }
        case addtListings:
        if(action.payload.page===1){
            return{
                ...state,
                data:action.payload.listings   
            }
        }
        else{
            return{
                ...state,
                data:[...state.data,...action.payload.listings]
            }
        }
        case showDescriptionModal:
        return{
            ...state,
            showDescription:true
        }
        case hideDescriptionModal:
        return{
            ...state,
            showDescription:false
        }
        case setQuery:
        return{
            ...state,
            query:action.payload
        }
        case setFavoriteIds:
            return{
                ...state,
                Favorites:action.payload
            }
        case setSubCategories:
            return{
                ...state,
                subCategories:action.payload
            }
        case setShippingProfile:
            return{
                ...state,
                shippingProfile:action.payload
            }
        case setShippings:
            return{
                ...state,
                shippings:action.payload
            }
        case selectShipping:
            return{
                ...state,
                selectedShipping:action.payload
            }
        case showOrderModal:
            return{
                ...state,
                showOrder:true
            }
        case hideOrderModal:
            return{
                ...state,
                showOrder:false
            }
        case renderOrder:
            return{
                ...state,
                order:action.payload
            }
        case setCategories:
            return{
                ...state,
                categories:action.payload
            }
        case showSubCategoriesMOdal:
            return{
                ...state,
                showSubCategories:true
            }
        case hideSubCategoriesMOdal:
            return{
                ...state,
                showSubCategories:false
            }
        case setSubCategoriesForListing:
            let data = state.categories.filter(cat=>{
                return cat._id === action.payload
            })
            return{
                ...state,
                subCategories:data[0].subCategories   
            }
        case setSubCategory:
            return{
                ...state,
                selectedSubCategory:action.payload
            }
        case setPaymentInfo:
            return{
                ...state,
                paymentInfo:action.payload
            }
        default:
        return state
    }
}