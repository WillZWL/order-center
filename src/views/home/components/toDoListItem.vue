<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item">
        <Col span="22" class="height-100">
            <p class="to-do-list-item-text">{{ content }}</p>
        </Col>
    </Row>
</template>

<script>
export default {
    name: 'toDoListItem',
    data () {
        return {
            todoitem: false
        };
    },
    props: {
        content: String
    },
};
</script>