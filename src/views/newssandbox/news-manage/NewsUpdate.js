import React, { useEffect, useRef, useState } from 'react'
import { Button, Steps, Form, Input, Select, notification } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import NewsEditor from '../../../components/news-manage/NewsEditor'
import style from './News.module.css'
import axios from 'axios';
export default function NewsUpdate(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setcategoryList] = useState([])
    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")
    const NewsForm = useRef(null)
    // const user = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        axios.get("/categories").then(res => {
            setcategoryList(res.data.map(item => {
                return {
                    value: item.id,
                    label: item.title,
                }
            }))

        })
    }, [])

    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data)
            let { title, categoryId, content } = res.data
            // console.log(value)
            NewsForm.current.setFieldsValue({
                title,
                categoryId: categoryId
            })
            setContent(content)
        })
    }, [props.match.params.id])

    const handleNext = () => {
        //校验
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res)
                setformInfo(res)
                setCurrent(current + 1)
            }).catch(err => { console.log(err) })
        }
        else {
            if (content === "" || content.trim() === "<p></p>") {
                alert("内容不能为空")
            }
            else setCurrent(current + 1)
        }
    }
    const handlePrevious = () => {
        setCurrent(current - 1)
    }
    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
            "createTime": Date.now(),
            // "publishTime": 0
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            notification.info({
                message: "通知",
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的文章`,
                placement: "bottomRight",
            });
        })
    }
    return (
        <div>
            <PageHeader
                className='site-page-header'
                title="更新博文"
                onBack={() => { props.history.goBack() }}
                subTitle="分享知识与快乐"
            />
            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: "博文标题，博文类别",
                    },
                    {
                        title: '博文内容',
                        description: "博文主体内容",
                    },
                    {
                        title: '提交',
                        description: "保存草稿或者提交审核",
                    },
                ]}
            />
            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        ref={NewsForm}
                        labelCol={{
                            span: 3,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                    >
                        <Form.Item
                            label="文章标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="文章分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Select
                                options={categoryList}
                            />
                        </Form.Item>


                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}>
                </div>
            </div>

            <div style={{ marginTop: '50px' }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>保存到草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}> 提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>

        </div >
    )
}
