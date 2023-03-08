import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/sidemenu/SideMenu'
import TopHeader from '../../components/sandbox/topheader/TopHeader'
import NProgress from 'nprogress'
import { Layout, theme } from 'antd';
import './Newssandbox.css'
import NewsRouter from '../../components/sandbox/newsRouter/NewsRouter';
const { Content } = Layout;
export default function Newssandbox() {
    NProgress.start()
    useEffect(() => {
        NProgress.done()
    }, [])
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        overflow: "auto"
                    }}
                >
                    <NewsRouter></NewsRouter>

                </Content>
            </Layout>
        </Layout>
    )
}
