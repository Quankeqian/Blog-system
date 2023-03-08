import React, { useEffect, useState } from 'react'
import { Spin } from 'antd';
import Home from '../../../views/newssandbox/home/Home'
import NoPermission from '../../../views/newssandbox/nopermission/NoPermission'
import RightList from '../../../views/newssandbox/right-manage/RightList'
import RoleList from '../../../views/newssandbox/right-manage/RoleList'
import UserList from '../../../views/newssandbox/user-manage/UserList'
import NewsAdd from '../../../views/newssandbox/news-manage/NewsAdd'
import NewsDraft from '../../../views/newssandbox/news-manage/NewsDraft'
import NewsCategory from '../../../views/newssandbox/news-manage/NewsCategory'
import NewsPreview from '../../../views/newssandbox/news-manage/NewsPreview'
import NewsUpdate from '../../../views/newssandbox/news-manage/NewsUpdate'
import Audit from '../../../views/newssandbox/audit-manage/Audit'
import AuditList from '../../../views/newssandbox/audit-manage/AuditList'
import Unpublished from '../../../views/newssandbox/publish-manage/Unpublished'
import Published from '../../../views/newssandbox/publish-manage/Published'
import Sunset from '../../../views/newssandbox/publish-manage/Sunset'
import Detail from '../../../views/newssandbox/home/Detail';

import { Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux';
const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset,
    "/detail/:id": Detail,
}
function NewsRouter(props) {
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:5000/rights"),
            axios.get("http://localhost:5000/children"),
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data, ...res[1].data])
        })
    }, [])
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    // console.log(rights)
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkPermission = (item) => {
        // console.log(rights.checked.includes(item.key))
        return rights.checked.includes(item.key)
    }
    return (
        <div>
            <Spin size="large" spinning={props.isLoading} >
                <Switch>
                    {
                        BackRouteList.map(item => {
                            if (checkRoute(item) && checkPermission(item)) {
                                return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
                            }
                            else return null
                        })
                    }
                    <Redirect from="/" to="/home" exact />
                    {
                        BackRouteList.length > 0 && <Route path="*" component={NoPermission} />
                    }

                </Switch>
            </Spin>
        </div>
    )
}
const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({ isLoading })
export default connect(mapStateToProps)(NewsRouter)