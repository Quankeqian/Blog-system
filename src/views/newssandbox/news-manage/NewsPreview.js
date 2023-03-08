import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment'
export default function NewsPreview(props) {
    const [newsInfo, setnewsInfo] = useState(null)
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data)
            setnewsInfo(res.data)
        })
    }, [props.match.params.id])
    const auditList = ["草稿箱", "审核中", "已通过", "未通过"]
    const publishList = ["未发布", "待发布", "已上线", "已下线"]
    const clostList = ["black", "orange", "green", "red"]
    return (
        <div>
            {newsInfo && <div>
                <PageHeader
                    onBack={() => window.history.back()}
                    title={newsInfo.title}
                    subTitle={newsInfo?.category.title}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态"><span style={{ color: clostList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                        <Descriptions.Item label="发布状态"><span style={{ color: clostList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                        <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                        <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                        <Descriptions.Item label="评论数量">0</Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <div dangerouslySetInnerHTML={{
                    __html: newsInfo.content
                }} style={{ border: "1px solid gray", margin: "0 19px", padding: "2px" }}>

                </div>
            </div>
            }
        </div>

    )
}
