import React from 'react'
import { Layout, theme, Dropdown, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import {
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
const { Header } = Layout;
function TopHeader(props) {
    // const [collapsed, setCollapsed] = useState(false)
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const changeCollapsed = () => {
        // setCollapsed(!collapsed)
        // console.log(props)
        props.changeCollapsed()
    }

    const items = [
        {
            key: '1',
            label: <div>{roleName}</div>,
        },
        {
            key: '2',
            danger: true,
            label: (<div onClick={() => {
                localStorage.removeItem("token")
                props.history.replace("/login")
            }}>退出</div>)
        },
    ];
    return (
        <Header
            style={{
                padding: '0 16px',
                background: colorBgContainer,
            }}
        >
            {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
            })} */}
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: "right" }}>
                <span style={{ marginRight: "10px" }}>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来</span>
                <Dropdown
                    menu={{
                        items,
                    }}
                >
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
const mapStateToProps = ({ Collapsedreducer: { isCollapsed } }) => {
    return {
        isCollapsed: isCollapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapse"
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))