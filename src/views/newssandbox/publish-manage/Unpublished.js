import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button } from 'antd'
export default function Unpublished() {
    const { dataSource, handelPublish } = usePublish(1)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary' onClick={() => { handelPublish(id) }}>发布</Button>}></NewsPublish>
        </div>
    )
}
// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import NewsPublish from '../../../components/publish-manage/NewsPublish'
// const { username } = JSON.parse(localStorage.getItem("token"))
// export default function Unpublished() {
//     const [dataSource, setdataSource] = useState([])
//     useEffect(() => {
//         axios.get(`/news?author=${username}&publishState=1&_expand=category`).then(res => {
//             setdataSource(res.data)
//         })
//     }, [])
//     return (
//         <div>
//             <NewsPublish dataSource={dataSource}></NewsPublish>
//         </div>
//     )
// }
