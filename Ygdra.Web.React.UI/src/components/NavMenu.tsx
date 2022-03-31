import * as React from 'react';
//import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
//import { Link } from 'react-router-dom';
import './NavMenu.scss';
import aljazeera_icon from '../images/aljazeera_icon.png'; // Tell webpack this JS file uses this image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThLarge, faLink, faBarcode, faDiceD6, faChartBar, faCogs, faTools } from '@fortawesome/free-solid-svg-icons'





type Props = {
    toggle: { isToggle: boolean }
}

const NavMenu: React.FunctionComponent<Props> = ({ toggle }): React.ReactElement => {

    React.useEffect(() => {
        let nav = document.getElementById('nav-bar');

        if (nav)
            nav.classList.toggle('nav-padding');

    }, [toggle]);



    return (
        <div className="l-navbar" id="nav-bar">
            <nav className="nav">
                <div>
                    <a href="/Index" className="nav_logo"><img src={aljazeera_icon} alt="Aljazeera icon" />
                        <span className="nav_logo-name">Aljazeera</span>
                    </a>
                    <div className="nav_list">
                        <a href="#top" className="nav_link" >  <FontAwesomeIcon icon={faCogs} /> <span className="nav_name">Dashboard 2</span> </a>
                        <a href="#top" className="nav_link" > <FontAwesomeIcon icon={faThLarge} /> <span className="nav_name">DataSources</span> </a>
                        <a href="#top" className="nav_link"> <FontAwesomeIcon icon={faLink} /> <span className="nav_name">Messages</span> </a>
                        <a href="#top" className="nav_link"> <FontAwesomeIcon icon={faBarcode} /> <span className="nav_name">Bookmark</span> </a>
                        <a href="#top" className="nav_link"> <FontAwesomeIcon icon={faDiceD6} /> <span className="nav_name">Files</span> </a>
                        <a href="#top" className="nav_link"> <FontAwesomeIcon icon={faChartBar} /> <span className="nav_name">Stats</span> </a>
                    </div>
                </div>
                <a href="#top" className="nav_link"> <FontAwesomeIcon icon={faTools} /> <span className="nav_name">SignOut</span> </a>
            </nav>
        </div>);
}

export default NavMenu;