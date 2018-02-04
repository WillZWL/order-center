<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="stats-bars"></Icon>
                        商品颜色尺寸销售报表
                    </p>
                    <Form :label-width="100" label-position="right">
                        <Row class="margin-top-10">
                            <Col span="8">
                                <FormItem label="商品名称" prop="channel_id">
                                    <Select placeholder="请选择商品名称">
                                        <Option value=""></Option>                                      
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
                                <Button type="primary" class="margin-right-10">各颜色销售统计</Button>                                                         
                                <Button type="primary">各尺寸销售统计</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>
