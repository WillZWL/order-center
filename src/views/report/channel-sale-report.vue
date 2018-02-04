<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="stats-bars"></Icon>
                        渠道销售报表
                    </p>
                    <Form :label-width="100" label-position="right">
                        <Row class="margin-top-10">
                            <Col span="8">
                                <FormItem label="销售渠道" prop="channel_id">
                                    <Select placeholder="请选择销售渠道">
                                        <Option value="1">京东</Option>
                                        <Option value="2">天猫</Option>
                                        <Option value="3">淘宝</Option>                                        
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="订单开始日期" prop="order_date">
                                    <DatePicker format="yyyy-MM-dd" type="date" placeholder="订单开始日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="订单结束日期" prop="order_date">
                                    <DatePicker format="yyyy-MM-dd" type="date" placeholder="订单结束日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>                       
                        </Row>
                        <Row>
                            <Col span="8" offset="9">              
                                <Button type="primary" class="margin-right-10">渠道汇总统计表</Button>                                                         
                                <Button type="primary">渠道销售明细表</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>
