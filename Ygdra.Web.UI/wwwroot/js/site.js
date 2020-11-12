//// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
//// for details on configuring this project to bundle and minify static web assets.

//// Write your Javascript code.


//function setMgtProvider() {
//    const provider = new mgt.ProxyProvider("/api/Proxy");
//    provider.login = () => window.location.href = '/Account/SignIn?redirectUri=' + window.location.href;
//    provider.logout = () => window.location.href = '/MicrosoftIdentity/Account/SignOut';

//    mgt.Providers.globalProvider = provider;

//}

//function interceptMgtLogin() {
//    var mgtlogin = document.getElementById('mgtlogin');

//    // Theses events are raised when user click on login our logout button
//    // Theyr are not raised at the good timing
//    // Should be renamed 'loginClick' and 'logoutClick'
//    mgtlogin.addEventListener('loginCompleted', () => localStorage.removeItem("userdetails"));
//    mgtlogin.addEventListener('logoutCompleted', () => localStorage.removeItem("userdetails"));

//    // get local storage item if any
//    var userDetailsFromStorageString = localStorage.getItem('userdetails');

//    if (userDetailsFromStorageString !== null && mgtlogin.userDetails === null)
//        mgtlogin.userDetails = JSON.parse(userDetailsFromStorageString);

//    // Loading completed is correctly fired AFTER component is loaded AND user logged in
//    mgtlogin.addEventListener('loadingCompleted', () => {
//        if (mgtlogin.userDetails !== null)
//            localStorage.setItem('userdetails', JSON.stringify(mgtlogin.userDetails));
//    });

//}


////Do not wait until the page is loaded to be sure we won't have any "clipping" visual effect
////And affect AS SOON AS POSSIBLE the user details object stored, if any
//setMgtProvider();
////interceptMgtLogin();
