import { shallowMount } from '@vue/test-utils';
import App from '../../src/App.vue';
describe('App', () => {
    test('should load main.js script on mount', () => {
      // Create a spy for the toggle method of the classList of the myDropdown element
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.head, 'appendChild');
  
      // Create a shallow mount instance of the App component
      const wrapper = shallowMount(App);
  
      // Check that the script was loaded correctly
      const scriptSrc = 'https://demo.dashboardpack.com/architectui-html-free/assets/scripts/main.js';
      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLScriptElement));
      const script = document.querySelector(`script[src="${scriptSrc}"]`);
      expect(script).toBeTruthy();
      expect(script.async).toBe(true);
  
      // Restore the original createElement and appendChild methods
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
    });
  });