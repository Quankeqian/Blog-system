import React from 'react'
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ReactCanvasNest from 'react-canvas-nest'
import './Login.css'
import axios from 'axios';
export default function Login(props) {
    const onFinish = (values) => {
        // console.log('Received values of form: ', values);
        axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            // console.log(res.data.length)
            if (res.data.length === 0) message.error("账号或密码错误")
            else {
                localStorage.setItem("token", JSON.stringify(res.data[0]))
                props.history.push("/")
            }
        })
    };
    return (
        <div style={{ background: 'rgb(35,39,65)', height: "100%" }}>
            <ReactCanvasNest
                className='canvasNest'
                config={{
                    pointColor: ' 255, 255, 255 ',
                    lineColor: '255,255,255',
                    lineWidth: 2,
                    pointOpacity: 0.5,
                    pointR: 2,
                    count: 100
                }}
                style={{ zIndex: 1 }}
            />

            <div className="formContainer" style={{ zIndex: 2 }}>
                <div className="loginTitle">“星聚”——HNUer聚集地</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div>
                            <div style={{ marginLeft: "70%" }}>
                                <Button type="primary" htmlType="submit" className="login-form-button" >
                                    登录
                                </Button>
                            </div>
                            <div className="loginTxt">探索校园美好</div>
                        </div>
                    </Form.Item>
                </Form>

            </div>
        </div>
    )
}
