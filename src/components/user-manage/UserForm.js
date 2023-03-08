import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd';
const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    const checkReginDisabled = (item) => {
        //判断是否为更新操作
        if (props.isupdate) {
            //判断是否为超级管理员
            if (roleId === 1) return false
            else return true
        } else {
            if (roleId === 1) return false
            else return item.value !== region
        }
    }
    const checkRoleDisabled = (item) => {
        //判断是否为更新操作
        if (props.isupdate) {
            //判断是否为超级管理员
            if (roleId === 1) return false
            else return true
        } else {
            if (roleId === 1) return false
            else return item.id !== 3
        }
    }
    return (
        <div>
            <Form
                layout="vertical"
                ref={ref}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisabled ? [] :
                        [
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                >
                    <Select disabled={isDisabled} options={props.regionList.map(item => {
                        return {
                            "value": item.value,
                            // "key": item.id,
                            "label": item.roleName,
                            disabled: checkReginDisabled(item),
                        }
                    })}>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={
                        [
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                >
                    <Select onChange={(val) => {
                        if (val === 1) {
                            setisDisabled(true)
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        }
                        else setisDisabled(false)
                    }} options={props.roleList.map(item => {
                        return {
                            "value": item.id,
                            // "key": item.id,
                            "label": item.roleName,
                            disabled: checkRoleDisabled(item),
                        }
                    })}>
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})
export default UserForm