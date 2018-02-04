<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row type="flex" class="user-infor">
                                <Col span="8">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <img class="avator-img" :src="avatorPath" />
                                    </Row>
                                </Col>
                                <Col span="16" style="padding-left:6px;">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <div>
                                            <b class="card-user-infor-name">{{ userName }}</b>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-checkbox-outline"></Icon>
                                待处理订单
                            </p>
                            <div class="to-do-list-con">
                                <div v-for="(item, index) in toDoList" :key="index" class="to-do-item">
                                    <to-do-list-item :content="item.title"></to-do-list-item>
                                </div>
                            </div>
                        </Card>
                        <Card class="margin-top-10">
                            <p slot="title" class="card-title">
                                <Icon type="android-checkbox-outline"></Icon>
                                本月客服销售额排行榜
                            </p>
                            <div class="to-do-list-con map-con">
                                <div v-for="(item, index) in toDoList" :key="index" class="to-do-item">
                                    <to-do-list-item :content="item.title"></to-do-list-item>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="count.createUser"
                            iconType="android-person-add"
                            color="#2d8cf0"
                            intro-text="今日销售额"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.visit"
                            iconType="ios-eye"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="今日订单数"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="collection_count"
                            :end-val="count.collection"
                            iconType="upload"
                            color="#ffd572"
                            intro-text="待审核订单数"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.transfer"
                            iconType="shuffle"
                            color="#f25e43"
                            intro-text="逾期订单数"
                        ></infor-card>
                    </Col>
                </Row>
                <Row>
                    <Card :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="map"></Icon>
                            本月地区销售排行
                        </p>
                        <div class="map-con">
                            <Col span="14">
                                <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>
                            </Col>
                            <Col span="10" class="margin-top-10">
                                <div class="data-source-row">
                                    <area-pie></area-pie>
                                </div>
                            </Col>
                        </div>
                    </Card>
                    <Card class="margin-top-10">
                        <p slot="title" class="card-title">
                            <Icon type="ios-pulse-strong"></Icon>
                            渠道销售额统计
                        </p>
                        <div class="map-con">
                            <Col span="14">
                                <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>
                            </Col>
                            <Col span="10" class="margin-top-10">
                                <div class="data-source-row">
                                    <data-source-pie></data-source-pie>
                                </div>
                            </Col>
                        </div>
                    </Card>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col>
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        上月销量额统计
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import areaPie from './components/areaPie.vue';

import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
import toDoListItem from './components/toDoListItem.vue';

export default {
    name: 'home',
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow,
        countUp,
        inforCard,
        mapDataTable,
        toDoListItem,
        areaPie,
    },
    data () {
        return {
            toDoList: [
                {
                    title: '新款Polo 衫'
                },
                {
                    title: '春季新款T恤'
                },
                {
                    title: '秋款卫衣'
                },
                {
                    title: '冬款羽绒服'
                },
                {
                    title: '定制T恤'
                }
            ],
            count: {
                createUser: 496,
                visit: 32649,
                collection: 243,
                transfer: 195
            },
            cityData: cityData,
            showAddNewTodo: false,
            newToDoItemValue: '',
            userName: this.$store.state.user.userName,
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
    }
};
</script>
