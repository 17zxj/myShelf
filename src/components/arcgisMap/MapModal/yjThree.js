/*
    窨井三维展示
*/

import React, { Component } from 'react'
import styles from './index.less';
import yjLine from '../../../assets/mapModal/yjLine.png';
import request from '../../../utils/request';
import config from '@/config';
import { message } from 'antd';
export default class extends Component {
    state = {
        leftLines: [],
        rightLines: [],
        pointZ: 0
    }
    componentDidMount() {
        this.getDetail(this.props.code)
    }
    componentDidUpdate(preProps) {
        if (this.props.code && this.props.code != preProps.code) {
            this.getDetail(this.props.code)
        }
    }
    getDetail = (code) => {
        request({
            url: `${config.baseUrl}/jiahe/jhPoint/getPointPortrayal`,
            method: 'GET',
            params: {
                code
            }
        }).then(res => {
            if (res.code == 0 && res.data.hasOwnProperty("pre")) {
                let { pre, back } = res.data;
                this.setState({
                    pre,
                    back,
                })
            } else {
                message.error(res.message, 2)
            }
        })
    }
    render() {
        let { pre = [], back = [] } = this.state;
        return (
            <div className={styles.yjThree}>
                <div className={styles.showThree}>
                    {
                        pre.reverse().map((v, i) => {
                            return (
                                <div style={{ position: 'relative', marginBottom: 14 }} className={styles.leftLines}>
                                    <div className={styles.linInfo}>
                                        <span>编号：<span title={v.code}>{v.code}</span></span>
                                        <span>埋深：<span title={v.deep?v.deep+'m':'--'}>{v.deep?v.deep+'m':'--'}</span></span>
                                    </div>
                                    <div></div>
                                    <img src={yjLine} />
                                </div>
                            )
                        })
                    }
                </div>
                <div className={`${styles.showThree} ${styles.offsetRight}`}>
                    {
                        back.reverse().map((v, i) => {
                            return (
                                <div style={{ position: 'relative', marginBottom: 14 }} className={styles.rightLines}>
                                    <div className={styles.linInfo}>
                                        <span>编号：<span title={v.code}>{v.code}</span></span>
                                        <span>埋深：<span title={v.deep?v.deep+'m':'--'}>{v.deep?v.deep+'m':'--'}</span></span>
                                    </div>
                                    <img src={yjLine} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}