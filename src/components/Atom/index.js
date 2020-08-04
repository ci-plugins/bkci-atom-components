import Accordion from './Accordion'
import AtomAceEditor from './AtomAceEditor'
import AtomCheckbox from './AtomCheckbox'
import AtomCheckboxList from './AtomCheckboxList'
import AtomDatePicker from './AtomDatePicker'
import CronTimer from './CronTimer'
import EnumInput from './EnumInput'
import FormField from '../FormField'
import KvParams from './KvParams'
import Parameter from './Parameter'
import RouteTips from './RouteTips'
import SelectInput from './SelectInput'
import Selector from './Selector'
import UserInput from './UserInput'
import TimePicker from './TimePicker'
import Tips from './Tips'
import VuexInput from './VuexInput'
import VuexTextarea from './VuexTextarea'

const components = {
    Accordion,
    AtomAceEditor,
    AtomCheckbox,
    AtomCheckboxList,
    AtomDatePicker,
    CronTimer,
    EnumInput,
    FormField,
    KvParams,
    Parameter,
    RouteTips,
    SelectInput,
    Selector,
    UserInput,
    TimePicker,
    Tips,
    VuexInput,
    VuexTextarea
}

export function install (Vue, opts = {}) {
    Object.values(components).forEach(component => {
        if (component.name) {
            Vue.component(component.name, component)
        }
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

const bkciAtoms = {
    ...components,
    install
}

export default bkciAtoms

