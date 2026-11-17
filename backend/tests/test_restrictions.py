from app.services.restrictions import FIELDS
def state(intake, limit):
    ratio=intake/limit
    return "exceeded" if ratio>=1 else "warning" if ratio>=.8 else "normal"
def test_threshold_boundaries():
    assert state(79,100)=="normal"
    assert state(80,100)=="warning"
    assert state(99.9,100)=="warning"
    assert state(100,100)=="exceeded"
def test_expected_nutrients_are_tracked(): assert set(FIELDS)=={"calories","protein","carbohydrates","fat","sugar"}
