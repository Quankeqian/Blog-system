import React, { useEffect, useRef, useState } from 'react'
import { Table, Button, Space, Modal, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios';
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;
export default function UserList() {
    const [dataSource, setdataSource] = useState([])
    const [roleList, setroleList] = useState([])
    const [regionList, setregionList] = useState([])
    const [isopen, setIsopen] = useState(false)
    const [isupdate, setIsupdate] = useState(false)
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const [current, setcurrent] = useState(null)
    const addForm = useRef(null)
    const updateForm = useRef(null)
    const { roleId, username, region } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get("http://localhost:5000/users?_expand=role").then(res => {
            const list = res.data
            setdataSource(roleId === 1 ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && item.roleId === 3)
            ])
        })
        axios.get("http://localhost:5000/roles").then(res => {
            setroleList(res.data)
        })
        axios.get("http://localhost:5000/regions").then(res => {
            setregionList(res.data)
        })
    }, [roleId, username, region])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => {
                    return {
                        text: item.title,
                        value: item.value
                    }
                }),
                {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {
                if (value === "全球") {
                    return item.region === ""
                } else {
                    return item.region === value
                }
            },
            // filterMode: 'tree',
            // filterSearch: true,
            // onFilter: (value, record) => record.name.startsWith(value),
            render: (region) => {
                return <b>{region === "" ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => switchMethod(item)}> </Switch >
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Space wrap>
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handelUpdate(item)} />
                    </Space>
                </div>
            }
        }
    ];
    const switchMethod = (item) => {
        item.roleState = !item.roleState
        setdataSource([...dataSource])
        axios.patch(`http://localhost:5000/users/${item.id}`, { roleState: item.roleState })
    }
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
        axios.delete(`http://localhost:5000/users/${item.id}`)
    }
    const addFormOK = () => {
        addForm.current.validateFields().then(value => {
            setIsopen(false)
            addForm.current.resetFields()
            axios.post(`http://localhost:5000/users`, {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res => {
                console.log(res.data)
                setdataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === value.roleId)[0]
                }])
            })
        }).catch(err => { console.log(err) })
    }
    const handelUpdate = (item) => {
        setIsupdate(true)
        if (item.roleId === 1) setisUpdateDisabled(true)
        else setisUpdateDisabled(false)
        setTimeout(() => {
            updateForm.current.setFieldsValue(item)
        }, 0)
        setcurrent(item)
    }
    const updateFormOK = () => {
        updateForm.current.validateFields().then(value => {
            setIsupdate(false)
            setdataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data =>
                            data.id === value.roleId
                        )[0]
                    }
                }
                return item
            }))
            setisUpdateDisabled(!isUpdateDisabled)
            axios.patch(`http://localhost:5000/users/${current.id}`, value)
        })
    }
    return (
        <div>
            <Button type="primary" style={{ "marginBottom": '10px' }} onClick={() => {
                setIsopen(true)
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} rowKey={(item) => item.id} />
            <Modal
                open={isopen}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => { setIsopen(false) }}
                onOk={() => addFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
            </Modal>
            <Modal
                open={isupdate}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setIsupdate(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isupdate={true}></UserForm>
            </Modal>
        </div >
    )
}

