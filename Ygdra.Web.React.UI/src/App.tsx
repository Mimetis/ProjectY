//import * as React from 'react';
//import { Route } from 'react-router';
import Layout from './components/Layout';
import SearchBoxFullSize from './components/Search';

import './custom.css'

const app = () => (
    <Layout>
        <div> Hello world </div>
        <SearchBoxFullSize ></SearchBoxFullSize>
    </Layout>
);

export default app;