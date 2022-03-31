import * as React from 'react';
import { Nav, INavLink, INavStyles, INavLinkGroup } from '@fluentui/react/lib/Nav';
import './NavMenuFluent.scss';

const navStylesStart: Partial<INavStyles> = {
    root: {
        width: '160px',
        maxwidth: '200px',
        left: '0',
        height: '100vh',
        boxSizing: 'border-box',
        border: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'fixed'
    },
};

const navLinkGroups: INavLinkGroup[] = [
    {
        links: [
            {
                name: 'News',
                url: 'http://cnn.com',
                icon: 'News',
                key: 'key1',
                target: '_blank',

            },
            {
                name: 'News',
                url: 'http://cnn.com',
                icon: 'VideoSearch',
                key: 'key2',
                target: '_blank',


            },
            {
                name: 'News',
                url: 'http://cnn.com',
                icon: 'DefectSolid',
                key: 'key3',
                target: '_blank',

            },
        ],
    },
];


type SelectedNavLinkItem = {
    key: string
}


const NavBasicExample: React.FunctionComponent = () => {


    const [navLinkSelected, setNavLinkSelected] = React.useState<SelectedNavLinkItem>({ key: 'key1' });
    const selectNavLink = (key: string) => { setNavLinkSelected({ key: key }); }

    const [navStyles, setNavStyles] = React.useState<Partial<INavStyles>>(navStylesStart);
    const updateNavStyles = (style: Partial<INavStyles>) => { setNavStyles(style); }

    const _onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {

        ev.preventDefault();
        console.log(navStyles);

        navStylesStart.root['width'] = '10px';
        updateNavStyles(navStylesStart);

        console.log(navStyles);
        selectNavLink(item.key);
    }


    return (
        <Nav
            onLinkClick={_onLinkClick}
            selectedKey={navLinkSelected.key}
            ariaLabel="Nav basic example"
            styles={navStyles}
            groups={navLinkGroups}
        />
    );
};

export default NavBasicExample;