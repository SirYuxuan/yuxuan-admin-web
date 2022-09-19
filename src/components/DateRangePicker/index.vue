<script>
  import { DatePicker, DatePickerOptions } from 'element-ui'
  import { calendarShortcuts } from '@/utils/shortcuts'
  import i18n from '@/plugins/i18n'
  export default {
    name: 'DateRangePicker',
    mixins: [DatePicker],
    props: {
      type: {
        type: String,
        default: 'daterange',
      },
      valueFormat: {
        type: String,
        default: 'yyyy-MM-dd HH:mm:ss',
      },
      defaultTime: {
        type: Array,
        default: (_) => ['00:00:00', '23:59:59'],
      },
      pickerOptions: {
        type: DatePickerOptions,
        default: (_) => {
          return { shortcuts: calendarShortcuts }
        },
      },
      size: {
        type: String,
        default: 'small',
      },
      rangeSeparator: {
        type: String,
        default: ':',
      },
      startPlaceholder: {
        type: String,
        default: i18n.t('crud.startTimePlaceholder'),
      },
      endPlaceholder: {
        type: String,
        default: i18n.t('crud.endTimePlaceholder'),
      },
    },
  }
</script>
