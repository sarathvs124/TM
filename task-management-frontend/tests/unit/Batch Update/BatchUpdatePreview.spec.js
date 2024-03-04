import Vue from 'vue';
import Vuetify from 'vuetify';
import Batch from '../../../src/views/AdminPage/BatchUpdatepreview.vue';
import { shallowMount } from '@vue/test-utils';

Vue.use(Vuetify);

describe('BatchUpdatepreview.vue', () => {
  it('should render the component', async () => {
    const wrapper = await shallowMount(Batch, {
      propsData: {
        Update_tid: Number,
      },
      mocks: {
        $store: {
          state: {
            taskId: '',
          },
        },
      },
      vuetify: new Vuetify(),
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should render v-row component', async () => {
    const wrapper = await shallowMount(Batch, {
      propsData: {
        Update_tid: Number,
      },
      mocks: {
        $store: {
          state: {
            taskId: '',
          },
        },
      },
      vuetify: new Vuetify(),
    });

    expect(wrapper.findComponent({ name: 'v-row' }).exists()).toBe(true);
  });

  it('should render v-col component', async () => {
    const wrapper = await shallowMount(Batch, {
      propsData: {
        Update_tid: Number,
      },
      mocks: {
        $store: {
          state: {
            taskId: '',
          },
        },
      },
      vuetify: new Vuetify(),
    });

    expect(wrapper.findComponent({ name: 'v-col' }).exists()).toBe(true);
  });
});
