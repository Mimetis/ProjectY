

export class mgtloader {


    static setMgtProvider() {
        const provider = new mgt.ProxyProvider("/api/Proxy");
        provider.login = () => window.location.href = '/Account/SignIn?redirectUri=' + window.location.href;
        provider.logout = () => window.location.href = '/Account/SignOut';

        mgt.Providers.globalProvider = provider;
    }

    static interceptMgtLogin() {
        var mgtlogin = document.getElementById('mgtlogin');

        //// Theses events are raised when user click on login our logout button
        //// Theyr are not raised at the good timing
        //// Should be renamed 'loginClick' and 'logoutClick'
        //mgtlogin.addEventListener('loginCompleted', () => localStorage.removeItem("userdetails"));
        //mgtlogin.addEventListener('logoutCompleted', () => localStorage.removeItem("userdetails"));

        //// get local storage item if any
        //var userDetailsFromStorageString = localStorage.getItem('userdetails');

        //if (userDetailsFromStorageString !== null && mgtlogin.userDetails === null)
        //    mgtlogin.userDetails = JSON.parse(userDetailsFromStorageString);

        //// Loading completed is correctly fired AFTER component is loaded AND user logged in
        //mgtlogin.addEventListener('loadingCompleted', () => {
        //    if (mgtlogin.userDetails !== null)
        //        localStorage.setItem('userdetails', JSON.stringify(mgtlogin.userDetails));
        //});

    }
}