import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import './SideMenu.css'
// import {
//     SettingOutlined,
// } from '@ant-design/icons';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
const { Sider } = Layout;

// function getItem(label, key, children, onTitleClick) {
//     return {
//         key,
//         children,
//         label,
//         onTitleClick,
//     };
// }
// const items = [
//     getItem('首页', '/home', <SettingOutlined />),
//     getItem('用户管理', '/user-manage', <SettingOutlined />, [
//         getItem('用户列表', '/user-manage/list'),
//     ]),
//     getItem('权限管理', '/right-manage', <SettingOutlined />, [
//         getItem('角色列表', '/right-manage/role/list'),
//         getItem('权限列表', '/right-manage/right/list'),
//     ]),
// ];


function SideMenu(props) {
    const [menu, setMenu] = useState([])
    const [tempmenu, setTempmenu] = useState([])
    const { role } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        // console.log(rights)
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            setTempmenu(res.data)
        })
    }, [])
    useEffect(() => {
        const datap = tempmenu.filter(data => {
            return data.pagepermisson === 1 && role.rights.checked.includes(data.key)
        })
        // console.log(datap)
        let datanew = datap.map(item => {
            const temp = item.children.filter((titem) => {
                return titem.pagepermisson === 1 && role.rights.checked.includes(titem.key)
            })
            let newchild = temp.map(citem => {
                return {
                    label: citem.title,
                    key: citem.key,
                    onClick: function () {
                        props.history.push(citem.key)
                    }
                }
            })
            if (item.children?.length > 0) {
                return {
                    label: item.title,
                    key: item.key,
                    children: newchild,
                    // onClick: function () {
                    //     props.history.push(item.key)
                    // }
                }
            }
            else {
                return {
                    label: item.title,
                    key: item.key,
                    onClick: function () {
                        props.history.push(item.key)
                    }
                }
            }
        })
        setMenu(datanew)
    }, [props.history, tempmenu])


    // const renderMenu = (menuList) => {
    //     return menuList.map(item => {
    //         if (item.children) {
    //             return <SubMenu key={item.key} icon={item.icon} label={item.label}>
    //                 {renderMenu(item.children)}
    //             </SubMenu>
    //         }
    //         return <Menu.Item key={item.key} icon={item.icon} onClick={() => {
    //             props.history.push(item.key)
    //         }} >{item.label}</Menu.Item>
    //     })
    // }
    const selectkeys = [props.location.pathname]
    const openkeys = ["/" + props.location.pathname.split("/")[1]]
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
                <div className="logo">星聚</div>
                <div className="logo_explain">HNUer聚集地</div>
                <div style={{ flex: 1, "overflow": "auto" }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultOpenKeys={openkeys}
                        selectedKeys={selectkeys}
                        items={menu}
                    >
                    </Menu>
                </div>
            </div>

        </Sider >
    )
}
const mapStateToProps = ({ Collapsedreducer: { isCollapsed } }) => ({ isCollapsed })
export default connect(mapStateToProps)(withRouter(SideMenu))
