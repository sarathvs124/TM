import Board from '../../../src/views/AdminPage/AdminBoard.vue';
import { shallowMount } from '@vue/test-utils';
describe('Board Page', () => {

    it('should render the components hi', () => {
        const wrapper = shallowMount(Board,{ 
            mocks: {
                $store: {
                  state: {
                     projectId:''
                  }
}}
              }
    );
    
        expect(wrapper.exists()).toBe(true);
      });
    

});