import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;
export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
    const [rightList, setRigthList] = useState([])
    const [currentRight, setCurrentRight] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {
        setIsModalOpen(false);
        //同步dataSource
        setdataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRight
                }
            }
            return item
        }))
        //后端同步
        axios.patch(`http://localhost:5000/roles/${currentId}`, { rights: currentRight })
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => {
            // console.log(res.data)
            setdataSource(res.data)
        })
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            // console.log(res.data)
            setRigthList(res.data)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Space wrap>
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                            setIsModalOpen(true);
                            setCurrentId(item.id)
                            // console.log(item.rights)
                            setCurrentRight(item.rights)
                        }} />
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
        axios.delete(`http://localhost:5000/roles/${item.id}`)
    }
    const onCheck = (checkedKeys) => {
        setCurrentRight(checkedKeys)
    };
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} rowKey={(item) => item.id} />
            <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRight}
                    treeData={rightList}
                    onCheck={onCheck}
                    checkStrictly={true}
                />
            </Modal>
        </div>

    )
}
