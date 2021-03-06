import React, {Component} from 'react'
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css' //样式文件
import {Link} from 'react-router-dom';
import {Card, message, Row, Col} from 'antd';

import BlogInfoFooter from '../../components/BlogInfoFooter'
import {TimetransferDetail} from '../../utils/TimeUtil'
import '../../asserts/css/blogInfo.scss'
import { rgbaColor } from '../../utils/Color'

import { getBlogContent } from "../../api/blogInfo";

/**
 * blog info 模块
 */
export default class Blog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            content: "",
            blogId: props.match.params.id
        }
    }


    componentWillMount() {
        //设置markdown的代码的高亮显示
        marked.setOptions({
            highlight: code => hljs.highlightAuto(code).value,
        });

        //获取数据
        this.getBlogContent(this.props.match.params.id);
    }


    //初次render时不执行，只有在父组件传递的props改变才执行
    // 如果父组件传递的值是ajax获取的，则需要使用这个生命周期函数获取props，否则获取不到
    //  在组件接收新props时调用。初始渲染不调用此方法。
    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            //状态改变的时候，采取执行加载数据的函数，否则不执行，提高性能
           this.getBlogContent(nextProps.match.params.id)
        }
    }


    getBlogContent = (id) => {
        // 获取数据
        getBlogContent(id)
            .then(response => {
                console.log("resp" , response)
                if(response.code === 20000) {
                    const data = response.data
                    //设置页面的title
                    document.title = data.title
                    // console.log("data",data)
                    this.setState({
                        content: data
                    })
                  }
            })
            .catch(err => {
                console.log(err)
                message.warning("文章不存在!");
            })
    }


    render() {
        const {content} = this.state;
        console.log(content.stared)
        return (
            <Row className='container'>
                {/*左边blog内容*/}
                <Col className='info-box'>
                    <Card>
                        <article className='info'>
                            <h3>{content.title}</h3>
                            <div className='detail'>
                                <div className='display-f'>
                                    <div>{TimetransferDetail(content.updatetime)}</div>
                                    <div className='tag'>
                                        分类:
                                        {
                                            content.categoryName ?
                                                content.categoryName.split(',').map((item, key) => {
                                                    return <Link key={key} to={`/cloud/${item}`}
                                                                 style={{backgroundColor: rgbaColor()}}
                                                                 className='tag-link'>
                                                                {item}
                                                            </Link>
                                                        })
                                                 : null
                                        }
                                    </div>
                                </div>
                                <div className='display-f'>
                                    <div className='read-great'>
                                        <i className='iconfont'>&#xe67c;</i>&nbsp;
                                        99
                                    </div>
                                    <div className='read-great'>
                                        <i className='iconfont'>&#xe7f4;</i>&nbsp;
                                        9999
                                    </div>
                                </div>
                            </div>

                            {/*将markdown语法转换为html,将内容中的标签进行解析为html并渲染，然后设置其中的高亮code*/}
                            <div className="news_con"
                                 dangerouslySetInnerHTML={{__html: marked(content.content ? content.content : "")}}/>

                        </article>

                    </Card>
                    
                    {/*博客footer*/}
                    <BlogInfoFooter blogId={this.state.blogId} isStar={this.state.content.stared} createDate={TimetransferDetail(content.updatetime)}/>

                </Col>
                {/*右边栏*/}
                <Col className='news-container'>
                    <Card className='news-card' bordered={false} title='最新文章'>
                        <div className='latest-blog'>
                            <ul>
                                <li>
                                    <Link to=''>关于js中原型和原型链的理解</Link>
                                </li>
                                <li>
                                    <Link to=''>操作系统：手把手带你扫盲 操作系统 的那些必知必会！</Link>
                                </li>
                                <li>
                                    <Link to=''>Vue 跳转路由传参以及获取参数</Link>
                                </li>
                                <li>
                                    <Link to=''>js相关的部分数据转换和处理</Link>
                                </li>
                                <li>
                                    <Link to=''>Vue el-select 获取label值</Link>
                                </li>
                            </ul>
                        </div>
                    </Card>
                    <Card className='news-card' title='热门文章'>
                        <div className='hot-blog'>
                            <div>
                                <Link to=''>vue移动端上拉加载</Link>
                                <p>阅读数 37</p>
                            </div>
                            <div>
                                <Link to=''>vue在App.vue文件中监听路由变化刷新页面</Link>
                                <p>阅读数 37</p>
                            </div>
                            <div>
                                <Link to=''>Vue 跳转路由传参以及获取参数</Link>
                                <p>阅读数 5</p>
                            </div>
                        </div>
                    </Card>
                    <Card className='news-card' title='最新评论'>
                        {/*TODO 通过点击文章title连接可以直接跳转到评论页面的高度，并且省略文字。*/}
                        <div className='latest-comment'>
                            <div>
                                <Link to='' className='comment-title'>鼠标位置的获取pageX，page内容隐藏的数据</Link>
                                <p className='comment ellipsis'>canfly666：确实有用，找了一个星期了，终于在这里找到了解决办法，真是多谢了额外人陪我</p>
                            </div>
                            <div>
                                <Link to=''>Sublime Text3 注册码加夫里什连接了封疆大吏老骥伏枥</Link>
                                <p className='comment ellipsis'>liuzhixiong_521：你这个写的不错哦!</p>
                            </div>
                            <div>
                                <Link to=''>Java中字符(串)和数值类型的转换</Link>
                                <p className='comment ellipsis'>hihell：为博主点赞</p>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        )
    }

}