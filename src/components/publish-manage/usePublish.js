import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
const { username } = JSON.parse(localStorage.getItem("token"))
function usePublish(type) {
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            console.log(res.data)
            setdataSource(res.data)
        })
    }, [])

    const handelPublish = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                message: "通知",
                description:
                    `您可以到[发布管理/已发布]中查看您的文章`,
                placement: "bottomRight",
            });
        })
    }
    const handelSunset = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 3,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                message: "通知",
                description:
                    `您可以到[发布管理/已下线]中查看您的文章`,
                placement: "bottomRight",
            });
        })
    }
    const handelDelete = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: "通知",
                description:
                    `您已经删除了该已下线的文章`,
                placement: "bottomRight",
            });
        })
    }
    return {
        dataSource,
        handelPublish,
        handelSunset,
        handelDelete

    }
}

export default usePublish