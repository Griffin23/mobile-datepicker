<template>
    <div>
        hello datepicker
        <button @click="selectDate">select {{ selectedDate }}</button>
    </div>
</template>

<script>
    export default {
        name: 'datepicker',
        data() {
            return {
                selectedDate: '2019-01-01'
            }
        },
        props: ['testProp'],
        created() {
            console.log('datepicker created ... ');
        },
        methods: {
            selectDate() {
                this.$emit('selectDate', this.selectedDate);
            }
        }
    }
</script>

<style>

</style>