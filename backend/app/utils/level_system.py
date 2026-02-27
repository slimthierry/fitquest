def xp_for_level(level: int) -> int:
    """Calculate total XP needed to complete a given level.

    XP per level: level * 100
    Level 1 = 100 XP, Level 2 = 200 XP, Level 3 = 300 XP, etc.
    """
    return level * 100


def total_xp_for_level(level: int) -> int:
    """Calculate the cumulative XP needed to reach a given level.

    Sum of all XP thresholds up to (but not including) the target level.
    To reach level 2: 100 XP (complete level 1)
    To reach level 3: 100 + 200 = 300 XP
    To reach level 4: 100 + 200 + 300 = 600 XP
    """
    return sum(xp_for_level(l) for l in range(1, level))


def calculate_level_from_xp(total_xp: int) -> int:
    """Determine the current level based on total XP accumulated."""
    level = 1
    xp_remaining = total_xp

    while xp_remaining >= xp_for_level(level):
        xp_remaining -= xp_for_level(level)
        level += 1

    return level


def xp_progress_in_level(total_xp: int, current_level: int) -> float:
    """Calculate the percentage progress within the current level (0-100)."""
    xp_at_level_start = total_xp_for_level(current_level)
    xp_in_current_level = total_xp - xp_at_level_start
    xp_needed = xp_for_level(current_level)

    if xp_needed == 0:
        return 0.0

    return min(round((xp_in_current_level / xp_needed) * 100, 1), 100.0)
