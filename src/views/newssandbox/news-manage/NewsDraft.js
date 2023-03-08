import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, notification } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;
export default function NewsDraft(props) {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [username])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '博文标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}> {title}</a >
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Space wrap>
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => { props.history.push(`/news-manage/update/${item.id}`) }} />
                        <Button shape="circle" icon={<UploadOutlined />} onClick={() => { handleCheck(item.id) }} />
                    </Space>
                </div>
            }
        }
    ];

    const confirmMethod = (item) => {
        confirm({
            title: '你确认删除吗?',
            icon: <ExclamationCircleFilled />,
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const deleteMethod = (item) => {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }

    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1,
            createTime: Date.now(),
        }).then(res => {
            props.history.push('/audit-manage/list')
            notification.info({
                message: "通知",
                description:
                    `您可以到审核列表中查看您的文章`,
                placement: "bottomRight",
            });
        }
        )
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} rowKey={(item) => item.id} />
        </div>
    )
}

