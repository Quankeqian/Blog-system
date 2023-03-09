import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, PieChartOutlined, HeartTwoTone, FireOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import axios from 'axios';
import * as ECharts from 'echarts';
import _ from 'lodash'
const { Meta } = Card;

export default function Home(props) {
    const [hotList, sethotList] = useState([])
    const [starList, setstarList] = useState([])
    const [visible, setvisible] = useState(false)
    const [pieChart, setpieChart] = useState(null)
    const [userList, setuserList] = useState([])
    const [allList, setallList] = useState([])
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get("http://localhost:5000/news?published=2&_expand=category&_sort=view&_order=desc&_limit=8").then(res => {
            // console.log(res.data)
            sethotList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("http://localhost:5000/news?published=2&_expand=category&_sort=star&_order=desc&_limit=8").then(res => {
            // console.log(res.data)
            setstarList(res.data)
        })
    }, [])
    //获取所有文章数据
    useEffect(() => {
        axios.get("http://localhost:5000/news?published=2&_expand=category").then(res => {
            // console.log(_.groupBy(res.data, item => item.region))
            renderBarView(_.groupBy(res.data, item => item.region))
            //将对象换位数组
            setallList(Object.entries(_.groupBy(res.data, item => item.category.title)))
            // console.log(allList)
        })
        //组件卸载时销毁
        return () => {
            window.onresize = null
        }
    }, [])
    //获取用户已发布的文章数据
    useEffect(() => {
        axios.get(`http://localhost:5000/news?published=2&author=${username}&_expand=category`).then(res => {
            // console.log(res.data)
            setuserList(res.data)
        })
    }, [username])
    const renderBarView = (obj) => {
        var myChart = ECharts.init(document.getElementById('bar'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '各学院发布情况'
            },
            tooltip: {},
            legend: {
                orient: 'vertical',
                left: 'right',
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "25",
                    interval: 0
                }
            },
            yAxis: { minInterval: 1 },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => {
            // console.log("resize")
            myChart.resize()
        }
    }
    const renderPieView = (obj) => {
        var currentList = userList.filter(item => item.author === username)
        var groupObj = _.groupBy(currentList, item => item.category.title)
        // console.log(groupObj)

        var chartDom = document.getElementById('pie')
        var myChart
        if (!pieChart) {
            myChart = ECharts.init(chartDom)
            setpieChart(myChart)
        } else {
            myChart = pieChart
        }
        var list = []
        for (var i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length,
            })
        }
        // console.log(list)
        var option
        option = {
            color: [
                "#85acfb",
                "#cfdffd",
                "#85e2bd",
                "#daf6eb",
                "#8795ae",
                "#dbdfe6",
                "#f8ce52",
                "#fdf0cb",
                "#9488fb",
                "#d5d0fd",
                "#93d6f1",
                "#def2fb",
                "#b088cb",
            ],
            title: {
                text: `${username}的内容数据`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        option && myChart.setOption(option)
    }
    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title={<div>热榜 <FireOutlined /></div>} bordered={false}>
                        <List
                            size="small"
                            bordered
                            dataSource={hotList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={<div>赞榜 <HeartTwoTone twoToneColor="#eb2f96" /></div>} bordered={false}>
                        <List
                            size="small"
                            bordered
                            dataSource={starList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Card
                            // style={{
                            //     height: 492,
                            // }}
                            cover={
                                <img
                                    alt="example"
                                    src="https://ts1.cn.mm.bing.net/th/id/R-C.9ed7a9bc0a0be54a78bd48eb0796a9ba?rik=hJqoV0A7tA6lXw&riu=http%3a%2f%2fwww.kepuchina.cn%2fdmkx%2fdmys%2f201908%2fW020190815379647680468.jpg&ehk=7YHHfcuSETzKjwHaLNi0ePnbideIAalSvC9vg%2bxzhoI%3d&risl=&pid=ImgRaw&r=0"
                                />
                            }
                            actions={[

                                <PieChartOutlined key="setting" onClick={() => {
                                    setvisible(true)
                                    setTimeout(() => {
                                        renderPieView()
                                    }, 0)
                                }} />,
                                <EditOutlined key="edit" onClick={() => { props.history.push("/news-manage/add") }} />,
                                <EllipsisOutlined key="ellipsis" />,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                                title={username}
                                description={
                                    <div>
                                        <b style={{ marginRight: "30px" }}>{region ? region : "全校"}</b>
                                        {roleName}
                                    </div>
                                }
                            />
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Drawer title="个人博客分类" width="500px" placement="right" onClose={() => { setvisible(false) }} open={visible}>
                <div id="pie" style={{
                    height: "400px",
                    width: "100%",
                    marginTop: "20px"
                }}></div>
            </Drawer>
            <div id="bar" style={{
                height: "300px",
                width: "100%",
                marginTop: "20px"
            }}></div>
            <PageHeader
                className="site-page-header"
                title="HNU聚集地"
                subTitle="查看博客"
            />
            <Row gutter={[16, 16]}>
                {
                    allList.map(item =>
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={true} hoverable={true}>
                                <List
                                    size="small"
                                    bordered={false}
                                    dataSource={item[1]}
                                    pagination={{
                                        pageSize: 3
                                    }}
                                    renderItem={(data) => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                />
                            </Card>
                        </Col>
                    )
                }

            </Row>
        </div >
    )
}
