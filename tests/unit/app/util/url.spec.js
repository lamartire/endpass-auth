const {
  queryParamsToObject,
  objectToQueryParams,
  appendQueryParametersToUrl,
} = require.requireActual('@/util/url');

describe('queryParamsToObject', () => {
  it('should transform query params to object', () => {
    expect(queryParamsToObject('')).toEqual({});
    expect(queryParamsToObject('?')).toEqual({});
    expect(queryParamsToObject('foo=bar&bar=baz')).toEqual({
      foo: 'bar',
      bar: 'baz',
    });
    expect(queryParamsToObject('?foo=bar&bar=baz')).toEqual({
      foo: 'bar',
      bar: 'baz',
    });
    expect(queryParamsToObject('?camel-case=foo&camel_case_too=bar')).toEqual({
      camelCase: 'foo',
      camelCaseToo: 'bar',
    });
  });
});

describe('objectToQueryParams', () => {
  it('should transform object to query string params', () => {
    expect(
      objectToQueryParams({
        foo: 'bar',
        bar: 'baz',
      }),
    ).toBe('foo=bar&bar=baz');
  });
});

describe('appendQueryParametersToUrl', () => {
  it('should append query parameters to url', () => {
    expect(
      appendQueryParametersToUrl('https://foo.bar', {
        foo: 'bar',
        bar: 'baz',
      }),
    ).toBe('https://foo.bar?foo=bar&bar=baz');
    expect(
      appendQueryParametersToUrl('https://foo.bar?foo=bar', {
        bar: 'baz',
      }),
    ).toBe('https://foo.bar?foo=bar&bar=baz');
  });
});
