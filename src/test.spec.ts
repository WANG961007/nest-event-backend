test('test is null',()=>{
    const n = null;
    expect(n).toBeNull();// the normal would be verify if n is actually null
})

test('2+2',()=>{
    const result = 2 + 2;
    expect(result).toBe(4);
})