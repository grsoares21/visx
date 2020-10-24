import React from 'react';
import { shallow, mount } from 'enzyme';
import { Text, getStringWidth } from '../src';
import { addMock, removeMock } from './svgMock';

describe('getStringWidth()', () => {
  it('should be defined', () => {
    expect(getStringWidth).toBeDefined();
  });
});

// TODO: Fix tests (jsdom does not support getComputedTextLength() or getBoundingClientRect()).  Maybe use puppeteer

describe('<Text />', () => {
  beforeEach(addMock);
  afterEach(removeMock);

  it('should be defined', () => {
    expect(Text).toBeDefined();
  });

  it('should not throw', () => {
    expect(() => shallow(<Text />)).not.toThrow();
    expect(() => shallow(<Text>Hi</Text>)).not.toThrow();
  });

  it('Does not wrap long text if enough width', () => {
    const wrapper = shallow<Text>(
      <Text width={300} style={{ fontFamily: 'Courier' }}>
        This is really long text
      </Text>,
    );

    expect(wrapper.instance().state.wordsByLines).toHaveLength(1);
  });

  it('Wraps text if not enough width', () => {
    const wrapper = shallow<Text>(
      <Text width={200} style={{ fontFamily: 'Courier' }}>
        This is really long text
      </Text>,
    );

    expect(wrapper.instance().state.wordsByLines).toHaveLength(2);
  });

  it('Does not wrap text if there is enough width', () => {
    const wrapper = shallow<Text>(
      <Text width={300} style={{ fontSize: '2em', fontFamily: 'Courier' }}>
        This is really long text
      </Text>,
    );

    expect(wrapper.instance().state.wordsByLines).toHaveLength(1);
  });

  it('Does not perform word length calculation if width or scaleToFit props not set', () => {
    const wrapper = shallow<Text>(<Text>This is really long text</Text>);

    expect(wrapper.instance().state.wordsByLines).toHaveLength(1);
    expect(wrapper.instance().state.wordsByLines[0].width).toBeUndefined();
  });

  it('Render 0 success when specify the width', () => {
    const wrapper = mount(
      <Text x={0} y={0} width={30}>
        0
      </Text>,
    );

    console.log('wrapper', wrapper.text());
    expect(wrapper.text()).toContain('0');
  });

  it('Render 0 success when not specify the width', () => {
    const wrapper = mount(
      <Text x={0} y={0}>
        0
      </Text>,
    );

    expect(wrapper.text()).toContain('0');
  });

  it('Render text when x or y is a percentage', () => {
    const wrapper = mount(
      <Text x="50%" y="50%">
        anything
      </Text>,
    );

    expect(wrapper.text()).toContain('anything');
  });

  it("Don't Render text when x or y is NaN", () => {
    const wrapperNan = mount(
      <Text x={NaN} y={10}>
        anything
      </Text>,
    );

    expect(wrapperNan.text()).not.toContain('anything');
  });

  it("Should render textPath when textPath is passed", () => {
    const wrapper = mount<Text>(<Text textPath="M10 10">Text path test</Text>);

    const textPath = wrapper.find('textPath');
    const path = wrapper.find('path');

    expect(textPath).toHaveLength(1);
    expect(path).toHaveLength(1);

    expect(textPath.props().href).toEqual(`#${path.props().id}`);
    expect(path.props().d).toEqual('M10 10');
  });

  it("Should not render textPath when textPath is not passed", () => {
    const wrapper = mount<Text>(<Text>Text path test</Text>);

    expect(wrapper.find('textPath')).toHaveLength(0);
    expect(wrapper.find('path')).toHaveLength(0);
  });
});
