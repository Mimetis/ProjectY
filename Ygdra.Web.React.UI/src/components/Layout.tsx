import * as React from 'react';
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { Container } from 'reactstrap';
import Header from './Header';
import NavMenu from './NavMenu';
import NavBasicExample from './NavMenuFluent';
import './Layout.scss';

type ToggleState = {
    isToggle: boolean
}

// Initialize icons in case this example uses them
initializeIcons();

const Layout: React.FunctionComponent = (props): React.ReactElement => {

    // Create a toggle state object, with a false default value.
    const [toggle, setToggle] = React.useState<ToggleState>({ isToggle: false });
    // Create an update function we can call
    const updateToggle = (v: boolean) => { setToggle({ isToggle: v }); }

    React.useEffect(() => {
        let c = document.getElementById('container-body');

        if (c) {
            c.classList.toggle('container-padding');
        }

    }, [toggle]);



    return (
        <div>
            <Header toggle={toggle} setToggle={updateToggle} />
            <NavBasicExample></NavBasicExample>
            {/* <NavMenu toggle={toggle} /> */}
            <Container id="container-body">
                {props.children}
            </Container>
        </div>
    );
}

export default Layout;

//export default class Layout extends React.PureComponent<{}, { children?: React.ReactNode }> {
//    public render() {
//        return (
//            <React.Fragment>
//                <Header />
//                <NavMenu />
//                <Container>
//                    <div> Hello world </div>
//                    {this.props.children}
//                </Container>
//            </React.Fragment>
//        );
//    }
//}