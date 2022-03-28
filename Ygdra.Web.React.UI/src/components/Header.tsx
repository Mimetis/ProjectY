import * as React from 'react';
import './Header.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBars, faCog } from '@fortawesome/free-solid-svg-icons'




type Props = {
    toggle: { isToggle: boolean }
    setToggle: (isToggle: boolean) => void
}

const NavMenu: React.FunctionComponent<Props> = ({ toggle, setToggle }): React.ReactElement => {


    React.useEffect(() => {
        let header = document.getElementById('header');

        if (header)
            header.classList.toggle('header-padding');

    }, [toggle]);


    const show = (ev: React.SyntheticEvent) => {
        console.log(toggle)
        setToggle(!toggle.isToggle)
    }

    return (
        <header className="header" id="header">
            <div className="header_toggle" id="header_toggle" onClick={(e) => show(e)}><FontAwesomeIcon icon={faBars} /></div>

            <div className="d-flex align-items-center justify-content-end settings">
                <a href="#" data-toggle="modal" data-target="#notif" data-type="notifications" data-title="Notifications" className="notif-bell">
                    <FontAwesomeIcon icon={faBell} />
                    <span className="notif-bell-content" id="notif-bell-content" >+</span>
                </a>
                <a href="#" data-toggle="modal" data-target="#settings" data-type="settings" data-title="Settings">
                    <FontAwesomeIcon icon={faCog} className="p-2" />
                </a>

            </div>
        </header>
    );

}

export default NavMenu;