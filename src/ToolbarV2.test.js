import { render, screen } from '@testing-library/react';
import ToolbarV2 from './ToolbarV2';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


Enzyme.configure({ adapter: new Adapter() });


describe('Testing that the buttons fire the functions', () => {
    let component;
    let instance;
    let spy;
    let input;
        it('Test that pdf button excecute pdf function, 3rd party program.', () => {
            component = shallow(<ToolbarV2/>)
            instance = component.instance()
            spy = jest.spyOn(instance, 'saveAsPDF');
            instance.forceUpdate();

            input = component.find(".pdf")
            input.simulate('click')
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('Test that send invite button excecute sendMail function, The rest is tested in backend', () => {
            component = shallow(<ToolbarV2/>)
            instance = component.instance()
            spy = jest.spyOn(instance, 'sendMail');
            instance.forceUpdate();

            input = component.find(".invite")
            
            input.simulate('click')
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('Test that codemirror is not active at start', () => {
            component = shallow(<ToolbarV2/>)
            
            expect(component.find(".Editor").length).toBe(1);
        });

        it('Test that codemirror is active after button is clicked', () => {
            component = shallow(<ToolbarV2/>)
            instance = component.instance();
            expect(component.find(".CodeMirror").length).toBe(0);
            expect(component.find(".Editor").length).toBe(1);
            input = component.find(".mode")
            

            input.simulate('click');
            expect(component.find(".CodeMirror").length).toBe(1);
        });

        it('Test that runCode is excecuted after button is pressed', () => {
            component = shallow(<ToolbarV2/>)
            instance = component.instance()
            spy = jest.spyOn(instance, 'runCode');
            instance.forceUpdate();

            input = component.find(".mode")
            input.simulate('click');

            input = component.find(".runCode")
            input.simulate('click')
            expect(spy).toHaveBeenCalledTimes(1);
        });
});
